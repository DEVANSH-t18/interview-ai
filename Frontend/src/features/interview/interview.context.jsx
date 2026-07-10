import { createContext,useState } from "react";


export const InterviewContext = createContext()

export const InterviewProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState(null)
    const [reports, setReports] = useState([])
    const [uploadProgress, setUploadProgress] = useState(0)
    const [loadingStep, setLoadingStep] = useState('idle')

    return (
        <InterviewContext.Provider value={{ 
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
        }}>
            {children}
        </InterviewContext.Provider>
    )
}