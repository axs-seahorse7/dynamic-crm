import React, { useState } from 'react'
import axios from 'axios'


function Register() {
  const url = import.meta.env.VITE_API_URI;
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '+91',
    businessEmail: '',
    businessContact: '',
    country: '',
    state: '',
  })

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function  handleSubmit(e) {
    e.preventDefault()
   const {data} = await axios.post(`${url}/api/register`, form, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
   console.log(data)
   
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="h-screen flex items-start flex-wrap-reverse lg:flex-nowrap">
        {/* Left column */}
        <div className="w-full lg:w-[60%] h-screen overflow-y-auto pt-10 pb-10 px-40" style={{scrollbarWidth:'none'}}>
          <div className="mb-8">
            <div className="text-teal-600 font-semibold">ZENTRO-CRM</div>
          </div>

          <div className="mb-6">
            <h2 className="text-3xl font-bold text-teal-600 tracking-wide">JOIN US TODAY</h2>
            <div className="w-40 h-px bg-gray-300 mt-3" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <section>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Basic Details of User</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Your Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  className='registrationInput'
                    />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Your email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="registrationInput"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Phone number</label>
                  <input
                  type='tel'
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91"
                    className="registrationInput"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Phone number</label>
                  <input
                  type='password'
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="password"
                    className="registrationInput"
                  /> 
                </div>
              </div>
            </section>

            <section className="pt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Company Valid Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Business Email</label>
                  <input
                    name="businessEmail"
                    value={form.businessEmail}
                    onChange={handleChange}
                    placeholder="Enter your business email"
                    className="registrationInput"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Business Contact</label>
                  <input
                    name="businessContact"
                    value={form.businessContact}
                    onChange={handleChange}
                    placeholder="Enter your business contact"
                    className="registrationInput"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Country</label>
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="Enter your business contact"
                    className="registrationInput"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">State</label>
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="Enter your business contact"
                    className="registrationInput"
                  />
                </div>
              </div>
            </section>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-teal-600 text-white text-sm font-medium rounded-sm px-4 py-2 hover:bg-teal-700"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>

        {/* vertical divider */}
        <div className="hidden lg:block w-px bg-gray-300 self-stretch " />

        {/* Right column (fixed content) */}
        <div className="flex-1 flex-col bg-teal-700 h-screen text-white px-12 pt-24">
          <div className="max-w-2xl">
            <h3 className="text-tea font-semibold">One Platform. Every Workflow. Infinite Possibilities.</h3>
            <p className="text-sm text--500 mt-4">A dynamic platform that adapts to any industry. Build your workflow, customize your system, and run your business your way.</p>
          </div>
          <div className='pt-10'>
            <img src="/images/young-people-discussing.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
