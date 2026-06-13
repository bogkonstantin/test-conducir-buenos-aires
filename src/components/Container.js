import * as React from "react"

const Container = ({children}) => {
    return (
        <div className="w-full px-4 py-8 sm:py-12">
            <main role="main" className="w-full flex flex-col content-center justify-center">
                <div className="w-full sm:max-w-md lg:max-w-lg m-auto animate-fade-up">
                    <div className="surface-card px-5 pt-6 pb-6 sm:px-8 sm:pt-8 sm:pb-7">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Container
