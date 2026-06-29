import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'
import useAppStore from '../context/AppContext'

// Set worker for pdfjs (using unpkg to guarantee exact version match)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB as requested
const ACCEPTED = { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], 'text/plain': ['.txt'] }

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function ResumeUploader() {
  const { uploadedFile, setUploadedFile, setBaseResume } = useAppStore()
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [uploadTime, setUploadTime] = useState(null)

  const extractText = async (file) => {
    try {
      let text = ''
      if (file.type === 'text/plain') {
        text = await file.text()
      } else if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        let fullText = ''
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          fullText += content.items.map(item => item.str).join(' ') + '\n'
        }
        text = fullText
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        text = result.value
      }
      setBaseResume(text)
      toast.success('Resume parsed successfully!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to parse file text.')
    }
  }

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      const msg = rejected[0].errors[0]?.code === 'file-too-large'
        ? 'File exceeds 5MB limit.'
        : 'Invalid file type. Use PDF, DOCX, or TXT.'
      setError(msg)
      toast.error(msg)
      return
    }
    if (accepted.length === 0) return
    const file = accepted[0]
    setError('')
    setUploading(true)
    setProgress(0)

    // Simulate upload progress
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 25
      if (p >= 100) {
        clearInterval(interval)
        setProgress(100)
        setUploading(false)
        setUploadedFile(file)
        setUploadTime(new Date())
        toast.success(`"${file.name}" uploaded!`)
        extractText(file)
      } else {
        setProgress(Math.min(p, 95))
      }
    }, 120)
  }, [setUploadedFile, setBaseResume])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: ACCEPTED, maxSize: MAX_SIZE, multiple: false,
  })

  const removeFile = (e) => {
    e.stopPropagation()
    setUploadedFile(null)
    setBaseResume('')
    setProgress(0)
    setUploadTime(null)
    toast('File removed', { icon: '🗑️' })
  }

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200
          ${isDragActive ? 'dropzone-active border-[var(--primary)] bg-[var(--primary)]/5' : 'border-[var(--border)] hover:border-[var(--primary-light)] hover:bg-[var(--bg-2)]'}`}
      >
        <input {...getInputProps()} />
        <AnimatePresence mode="wait">
          {uploadedFile ? (
            <motion.div key="file" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-950/30 flex items-center justify-center flex-shrink-0">
                <CheckCircle size={20} className="text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text)] truncate">{uploadedFile.name}</p>
                <div className="flex gap-2 text-xs text-[var(--text-muted)]">
                  <span>{formatBytes(uploadedFile.size)}</span>
                  {uploadTime && <span>• {uploadTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                </div>
              </div>
              <button onClick={removeFile} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-[var(--text-muted)] hover:text-red-500 transition-colors">
                <X size={16} />
              </button>
            </motion.div>
          ) : (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div
                animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                className="w-12 h-12 bg-[var(--bg-2)] border border-[var(--border)] rounded-2xl mx-auto mb-3 flex items-center justify-center"
              >
                <Upload size={22} className="text-[var(--primary)]" />
              </motion.div>
              <p className="text-sm font-semibold text-[var(--text)] mb-1">
                {isDragActive ? 'Drop it here!' : 'Drag & drop your resume or click to browse'}
              </p>
              <p className="text-xs text-[var(--text-muted)] mb-3">PDF, DOCX, or TXT • Max 5MB</p>
              <span className="btn-outline px-4 py-2 text-xs font-semibold rounded-lg inline-block hover:bg-[var(--primary)] hover:text-white transition-colors">Browse Files</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploading && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
              <span>Uploading & Parsing...</span><span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-xs text-[var(--danger)] bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-xl">
            <AlertCircle size={14} />{error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
