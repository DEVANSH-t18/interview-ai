import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { 
        loading, 
        setLoading, 
        report, 
        setReport, 
        reports, 
        setReports,
        uploadProgress,
        setUploadProgress,
        loadingStep,
        setLoadingStep
    } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        setUploadProgress(0)
        
        let simulatedTimer = null
        
        if (resumeFile) {
            setLoadingStep('uploading')
        } else {
            setLoadingStep('analyzing')
        }
        
        const startSimulation = (initialStep) => {
            let step = initialStep
            const runTransition = () => {
                if (step === 'extracting') {
                    simulatedTimer = setTimeout(() => {
                        setLoadingStep('analyzing')
                        step = 'analyzing'
                        runTransition()
                    }, 3000)
                } else if (step === 'analyzing') {
                    simulatedTimer = setTimeout(() => {
                        setLoadingStep('finalizing')
                        step = 'finalizing'
                    }, 6000)
                }
            }
            runTransition()
        }

        if (!resumeFile) {
            startSimulation('analyzing')
        }

        let response = null
        try {
            response = await generateInterviewReport({
                jobDescription,
                selfDescription,
                resumeFile,
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        setUploadProgress(percentCompleted)
                        if (percentCompleted === 100) {
                            setLoadingStep('extracting')
                            startSimulation('extracting')
                        }
                    }
                }
            })
            setReport(response?.interviewReport || null)
        } catch (error) {
            console.log(error)
        } finally {
            if (simulatedTimer) clearTimeout(simulatedTimer)
            setLoading(false)
            setLoadingStep('idle')
            setUploadProgress(0)
        }

        return response?.interviewReport || null
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response?.interviewReport || null)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return response?.interviewReport || null
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response?.interviewReports || [])
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response?.interviewReports || []
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        let response = null
        try {
            response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf, uploadProgress, loadingStep }

}