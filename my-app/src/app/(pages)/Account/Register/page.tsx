

const Register = () => {
    return (
        <div className='max-w-[1440px] font-poppins w-full' >


            <div className="flex flex-col md:flex-row justify-between w-[80%] mx-auto py-10">

                {/* Register */}
                <div className="flex flex-col gap-8 md:w-[40%] w-full mx-auto">
                    <h1 className="font-semibold text-4xl">Register</h1>

                    <form method="POST" className="flex flex-col gap-7">
                        <div className="flex flex-col gap-4">
                            <label htmlFor="text" className="text-base font-medium">
                                Email address
                            </label>
                            <input
                                type="text"
                                id="text"
                                name="username"
                                className="mt-1 p-6 border border-[#9F9F9F] md:w-[453px] lg:h-[75px] h-12 rounded-[10px]  focus:outline-none"
                                placeholder=""
                                required
                            />
                        </div>

                         <div className="flex flex-col gap-4 font-light text-base w-full">
                            <p>A link to set a new password will be sent to your email address.</p>
                            <p>Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <span className="font-semibold">privacy policy</span>.</p>
                        </div>

                        <div className="flex items-center md:mt-15">
                        <button 
                        type="submit"
                        className="font-normal text-xl w-[215px] md:h-16 h-14 rounded-[15px] border border-black">
                        Register
                        </button>
                
                        </div>
                    </form>

                </div>

            </div>

        </div>
    )
}

export default Register