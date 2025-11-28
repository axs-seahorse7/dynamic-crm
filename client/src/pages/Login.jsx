import React from 'react'

const Login = () => {
  return (
    <div className='flex w-full bg-[#F1F1F1]'>
        {/* Left side container */}
      <div className='w-[60%] h-screen flex flex-col px-10 py-5'>
        <div className='text-[#209D93] font-semibold '>Dynamic-CRM</div>
        <div className='mt-10 px-30'>
            <p className='font-bold text-md'>Welcome Back!</p>
            <p className='text-sm mt-2' style={{fontFamily:"inter-regular"}}>
                Sign in to access your Dashboard and continue <br />
                optimizing your work 
            </p>
        </div>
        <div className='w-full px-30 '>
            <form className='flex flex-col mt-6'>

                <label className='text-sm font-semibold mb-1'>Email</label>
                <div className='flex py-1 gap-3 focus-within:border-[#187f7b] bg-white border border-[#435663]  rounded-md px-2  mb-4'>
                <i class="ri-mail-line text-[#435663]"></i>
                <input
                    type="email"
                    className=' w-full placeholder:font-thin placeholder:text-sm outline-none '
                    placeholder='Enter your email'
                />
                </div >

                <label className='text-sm font-semibold mb-1'>Password</label>
                <div className='flex py-1 gap-3 w-full  bg-white   border  border-[#435663] focus-within:border-[#187f7b] rounded-md px-2 '>
                <i class="ri-lock-password-line text-[#435663]"></i>
                <input
                    type="password"
                    className=' w-full  placeholder:font-thin placeholder:text-sm outline-none '
                    placeholder='Enter your password'
                />
                </div>
                <p className='text-[9px] mt-2 '>Forgot password? <span className='text-[#209D93] font-semibold'>Reset it.</span></p>
                <button
                    type="submit"
                    className='w-full bg-[#209D93] text-white py-1 rounded-md hover:bg-[#187f7b] transition duration-300 mt-5'
                >
                    Login
                </button>

            </form>

                <div>
                <button
                    type="submit"
                    className='w-full flex justify-center items-center gap-2 border border-[#435663] py-1 rounded-md hover:bg-[#187f7b] hover:text-white bg-white transition duration-300 mt-5'
                >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Google-Icon--Streamline-Svg-Logos" height={24} width={15} ><desc>{"\n    Google Icon Streamline Icon: https://streamlinehq.com\n  "}</desc><path fill="#4285f4" d="M23.5151 12.2611c0 -0.9661 -0.0784 -1.6711 -0.24805 -2.4022H12.2351v4.3605h6.4755c-0.1305 1.08365 -0.8355 2.7156 -2.4022 3.8122l-0.02195 0.146 3.4881 2.702175 0.24165 0.024125c2.2194 -2.04975 3.4989 -5.0656 3.4989 -8.6428Z" strokeWidth={0.25} /><path fill="#34a853" d="M12.234975 23.75c3.17245 0 5.83575 -1.0445 7.7811 -2.8461L16.308275 18.031625c-0.9922 0.69195 -2.3239 1.175 -4.0733 1.175 -3.1072 0 -5.7444 -2.049675 -6.6845 -4.882725l-0.137775 0.0117L1.7857125 17.14255l-0.0474325 0.13185C3.670475 21.112725 7.639375 23.75 12.234975 23.75Z" strokeWidth={0.25} /><path fill="#fbbc05" d="M5.550625 14.3239c-0.248075 -0.7311 -0.391625 -1.5145 -0.391625 -2.3239 0 -0.8095 0.143575 -1.5928 0.378575 -2.3239l-0.006575 -0.1557L1.858565 6.66835l-0.120155 0.05715C0.9420575 8.3183 0.4851075 10.10695 0.4851075 12c0 1.89305 0.45695 3.6816 1.2533025 5.2744l3.812215 -2.9505Z" strokeWidth={0.25} /><path fill="#eb4335" d="M12.234975 4.7933c2.20635 0 3.69465 0.95305 4.5433 1.7495L20.094375 3.305C18.057775 1.41195 15.407425 0.25 12.234975 0.25 7.639375 0.25 3.670475 2.8872 1.73828 6.7255L5.537425 9.6761c0.95315 -2.83305 3.59035 -4.8828 6.69755 -4.8828Z" strokeWidth={0.25} /></svg>
                <span className='text-[11px]'>Login with Google</span>
                </button> 
                <button
                    type="submit"
                    className='w-full border border-[#435663] py-1 rounded-md hover:bg-[#187f7b] hover:text-white bg-white transition duration-300 mt-5'
                >
                   <i class="ri-apple-fill"></i> <span className='text-[11px]'>Login with Apple</span>
                </button>
                <button
                    type="submit"
                    className='w-full text-[10px] mt-4'
                >
                   Don't have an account? <span className='text-[#209D93] font-semibold cursor-pointer '>Sign up</span>
                </button>

                </div>
        </div>
      </div>

      {/* Right side container */}
      <div className='w-[40%] h-screen bg-[#435663] px-15 '>
        <div>
            <p className=' mt-12 text-2xl text-[#209D93] ' style={{fontFamily: 'jamolhari'}}>
                One CRM to Rule Your Entire Business Workflow.
            </p>
            <p className='text-[10px] mt-3 text-white' >
                A dynamic, multi-industry solution built to simplify 
                and centralize your entire workflow. Start with a ready-made 
                template, then customize everything — 
                fields, processes, automations. Whatever your business is, 
                this platform becomes the system you need.
            </p>
            <div className='py-10'>
                <img src="./images/young-man-working.png" />
            </div>
        </div>
      </div>
    </div>
  )
}

export default Login
