import toast from 'react-hot-toast'
import { UnauthorizedError } from 'lemma-sdk'
import useAppStore from '../context/AppContext'
import { lemmaClient, LEMMA_WORKFLOW } from '../lib/lemmaClient.js'

function extractJSON(str) {
  try {
    return JSON.parse(str)
  } catch {
    const match = str.match(/\{[\s\S]*\}/)
    if (match) {
      try {
        return JSON.parse(match[0])
      } catch {
        throw new Error('Failed to parse AI JSON response.')
      }
    }
    throw new Error('AI did not return a valid JSON format.')
  }
}

function handleAuthError(err) {
  if (err instanceof UnauthorizedError || err?.statusCode === 401) {
    toast.error('Session expired. Please refresh the page to sign in again.')
    throw new Error('Session expired (401)')
  }
  throw err
}

export async function runTailorWorkflow(baseResumeText, jobDescriptionText, onStepChange) {
  const store = useAppStore.getState()

  store.setIsGenerating(true)
  store.setError('')
  store.setPipelineStep(0)
  onStepChange?.(0)

  try {
    // 1. Create workflow run (SDK handles auth + cookie refresh automatically)
    let run
    try {
      run = await lemmaClient.workflows.runs.create(LEMMA_WORKFLOW)
    } catch (err) {
      handleAuthError(err)
    }

    // 2. Submit intake form
    const nodeId = run.active_wait?.node_id || 'intake'
    try {
      run = await lemmaClient.workflows.runs.submitForm(run.id, {
        node_id: nodeId,
        inputs: {
          base_resume_text: baseResumeText,
          job_description_text: jobDescriptionText,
        },
      })
    } catch (err) {
      handleAuthError(err)
      throw new Error(`Failed to submit form: ${err.message}`)
    }

    // 3. Poll for completion
    const maxAttempts = 120 // 120 * 5s = 10 minutes max wait
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 5000))

      let status
      try {
        status = await lemmaClient.workflows.runs.get(run.id)
      } catch (err) {
        handleAuthError(err)
        throw new Error(`Poll failed: ${err.message}`)
      }

      if (status.status === 'COMPLETED') {
        store.setPipelineStep(8)
        onStepChange?.(8)

        const answerRaw = status.execution_context?.process?.answer || '{}'
        const data = extractJSON(answerRaw)

        store.setAiData(data)

        store.addToHistory({
          id: run.id,
          date: new Date().toISOString(),
          preview: data.tailoredResume?.slice(0, 120) || 'Tailored resume generated.',
          fullText: data.tailoredResume,
          atsScore: data.atsScore,
        })

        toast.success('Resume tailored successfully! ✨')
        return data
      }

      if (status.status === 'FAILED') {
        throw new Error('Workflow failed: ' + (status.error || 'Unknown'))
      }
    }

    throw new Error('Timed out waiting for AI response.')
  } catch (err) {
    store.setPipelineStep(-1)
    store.setError(err.message)
    if (!err.message.includes('401')) toast.error(err.message)
    throw err
  } finally {
    store.setIsGenerating(false)
  }
}
