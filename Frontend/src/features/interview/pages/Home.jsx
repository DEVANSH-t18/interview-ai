import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import Footer from '../../../components/Footer'

const Home = () => {

    const { loading, generateReport, reports, uploadProgress, loadingStep } = useInterview()
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ selectedFile, setSelectedFile ] = useState(null)
    const [ fileError, setFileError ] = useState("")
    const [ generalError, setGeneralError ] = useState("")
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Validate file format
            const allowedExtensions = /(\.pdf|\.docx)$/i;
            if (!allowedExtensions.exec(file.name)) {
                setFileError("Invalid file type. Please upload a PDF or DOCX file.")
                setSelectedFile(null)
                return
            }
            // Validate file size (max 3MB, matching backend limits)
            const maxSizeBytes = 3 * 1024 * 1024;
            if (file.size > maxSizeBytes) {
                setFileError("File is too large. Maximum size is 3MB.")
                setSelectedFile(null)
                return
            }
            setFileError("")
            setGeneralError("")
            setSelectedFile(file)
        }
    }

    const handleRemoveFile = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setSelectedFile(null)
        setFileError("")
        if (resumeInputRef.current) {
            resumeInputRef.current.value = ""
        }
    }

    const handleGenerateReport = async () => {
        if (!jobDescription.trim()) {
            setGeneralError("Please paste the job description first.")
            return
        }
        if (!selectedFile && !selfDescription.trim()) {
            setGeneralError("Please upload a resume or write a quick self-description.")
            return
        }
        setGeneralError("")

        const resumeFile = selectedFile
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        if (data && data._id) {
            navigate(`/interview/${data._id}`)
        }
    }

    if (loading) {
        // Step list config
        const steps = [
            { id: 'uploading', label: selectedFile ? `Uploading resume... ${uploadProgress}%` : 'Skipped resume upload' },
            { id: 'extracting', label: 'Extracting resume content' },
            { id: 'analyzing', label: 'Analyzing job alignment & skill gaps' },
            { id: 'finalizing', label: 'Generating preparation plan & questions' }
        ];

        const getStepStatus = (stepId) => {
            const stepOrder = ['uploading', 'extracting', 'analyzing', 'finalizing'];
            const currentIndex = stepOrder.indexOf(loadingStep);
            const stepIndex = stepOrder.indexOf(stepId);

            if (stepId === 'uploading' && !selectedFile) {
                return 'completed';
            }

            if (currentIndex === -1) return 'waiting';
            if (stepIndex < currentIndex) return 'completed';
            if (stepIndex === currentIndex) return 'active';
            return 'waiting';
        };

        const getProgressBarWidth = () => {
            if (loadingStep === 'uploading') return `${uploadProgress}%`;
            if (loadingStep === 'extracting') return '40%';
            if (loadingStep === 'analyzing') return '70%';
            if (loadingStep === 'finalizing') return '90%';
            return '100%';
        };

        const getProgressBarLabel = () => {
            if (loadingStep === 'uploading') return 'Uploading File';
            if (loadingStep === 'extracting') return 'Processing Text';
            if (loadingStep === 'analyzing') return 'Analyzing Match';
            return 'Finalizing Dashboard';
        };

        const getProgressBarPct = () => {
            if (loadingStep === 'uploading') return `${uploadProgress}%`;
            if (loadingStep === 'extracting') return '40%';
            if (loadingStep === 'analyzing') return '70%';
            return '90%';
        };

        return (
            <main className='loading-screen'>
                <div className='loading-screen__card'>
                    <div className='loading-screen__header'>
                        <h1>Creating Your Strategy</h1>
                        <p>Our AI is analyzing the requirements to prepare your custom dashboard.</p>
                    </div>

                    <div className='loading-screen__progress-wrapper'>
                        <div className='loading-screen__progress-bar-bg'>
                            <div 
                                className='loading-screen__progress-bar-fill' 
                                style={{ width: getProgressBarWidth() }} 
                            />
                        </div>
                        <div className='loading-screen__progress-info'>
                            <span className='progress-label'>{getProgressBarLabel()}</span>
                            <span className='progress-pct'>{getProgressBarPct()}</span>
                        </div>
                    </div>

                    <div className='loading-screen__steps'>
                        {steps.map((step) => {
                            const status = getStepStatus(step.id);
                            return (
                                <div 
                                    key={step.id} 
                                    className={`loading-screen__step loading-screen__step--${status}`}
                                >
                                    <span className='step-dot'>
                                        {status === 'active' && (
                                            <svg className="spinner-mini" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                <circle cx="12" cy="12" r="10" strokeDasharray="30 30" strokeLinecap="round">
                                                    <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
                                                </circle>
                                            </svg>
                                        )}
                                    </span>
                                    <span className='step-label'>{step.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <div className='home-page'>

            {/* Page Header */}
            <header className='page-header'>
                <h1>Create Your Custom <span className='highlight'>Interview Plan</span></h1>
                <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
            </header>

            {/* Main Card */}
            <div className='interview-card'>
                <div className='interview-card__body'>

                    {/* Left Panel - Job Description */}
                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                            </span>
                            <h2>Target Job Description</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>
                        <textarea
                            onChange={(e) => { 
                                setJobDescription(e.target.value) 
                                if(generalError && e.target.value.trim()) setGeneralError("")
                            }}
                            className='panel__textarea'
                            placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                            maxLength={5000}
                        />
                        <div className='char-counter'>{jobDescription.length} / 5000 chars</div>
                    </div>

                    {/* Vertical Divider */}
                    <div className='panel-divider' />

                    {/* Right Panel - Profile */}
                    <div className='panel panel--right'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </span>
                            <h2>Your Profile</h2>
                        </div>

                        {/* Upload Resume */}
                        <div className='upload-section'>
                            <label className='section-label'>
                                Upload Resume
                                <span className='badge badge--best'>Best Results</span>
                            </label>
                            
                            {!selectedFile ? (
                                <label className='dropzone' htmlFor='resume'>
                                    <span className='dropzone__icon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                    </span>
                                    <p className='dropzone__title'>Click to upload or drag &amp; drop</p>
                                    <p className='dropzone__subtitle'>PDF or DOCX (Max 3MB)</p>
                                    <input 
                                        ref={resumeInputRef} 
                                        hidden 
                                        type='file' 
                                        id='resume' 
                                        name='resume' 
                                        accept='.pdf,.docx' 
                                        onChange={handleFileChange}
                                    />
                                </label>
                            ) : (
                                <div className='staged-file-card'>
                                    <div className='staged-file-card__info'>
                                        <span className='staged-file-card__icon'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                        </span>
                                        <div className='staged-file-card__details'>
                                            <p className='staged-file-card__name'>{selectedFile.name}</p>
                                            <p className='staged-file-card__size'>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        className='staged-file-card__remove-btn' 
                                        onClick={handleRemoveFile}
                                        title="Remove file"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                    </button>
                                </div>
                            )}
                            {fileError && <p className='file-error-msg'>{fileError}</p>}
                        </div>

                        {/* OR Divider */}
                        <div className='or-divider'><span>OR</span></div>

                        {/* Quick Self-Description */}
                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                            <textarea
                                onChange={(e) => { 
                                    setSelfDescription(e.target.value) 
                                    if(generalError && e.target.value.trim()) setGeneralError("")
                                }}
                                id='selfDescription'
                                name='selfDescription'
                                className='panel__textarea panel__textarea--short'
                                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                            />
                        </div>

                        {/* Info Box */}
                        <div className='info-box'>
                            <span className='info-box__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2" /></svg>
                            </span>
                            <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
                        </div>
                    </div>
                </div>

                {/* Card Footer */}
                <div className='interview-card__footer' style={{ flexDirection: 'column', gap: '0.75rem', alignItems: 'stretch' }}>
                    {generalError && (
                        <p className='general-error-msg' style={{ color: '#ff4d4d', fontSize: '0.85rem', margin: '0 0 0.5rem 0', textAlign: 'center', fontWeight: '500' }}>
                            {generalError}
                        </p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <span className='footer-info'>AI-Powered Strategy Generation &bull; Approx 30s</span>
                        <button
                            onClick={handleGenerateReport}
                            className='generate-btn'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                            Generate My Interview Strategy
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Reports List */}
            {reports.length > 0 && (
                <section className='recent-reports'>
                    <h2>My Recent Interview Plans</h2>
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || 'Untitled Position'}</h3>
                                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Page Footer */}
            <Footer />
        </div>
    )
}

export default Home