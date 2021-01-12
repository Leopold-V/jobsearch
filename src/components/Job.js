import React, { useState } from 'react';

export const Job = () => {
    
    const API_URL = 'https://jobs.github.com/positions.json?';
    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

    const [search, setSearch] = useState('');
    const [jobList, setJobList] = useState([]);
    const [loading, setLoading] = useState(false);

    const getJobs = async (search) => {
        setLoading(true);
        const rep = await fetch(PROXY_URL + API_URL + 'description=' + search, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                }
        });
        const result = await rep.json();
        setJobList(result);
        setLoading(false);
    }

    const handleChange = (e) => {
        setSearch(e.target.value);
    }


    const handleSearch = (e) => {
        e.preventDefault();
        getJobs(search);
        
    }

    return (
        <div className="min-h-screen">
            <h1 className="title text-3xl font-bold text-center w-full p-16">Job search</h1>
            <form onSubmit={handleSearch} className="inputsection pb-10 flex items-center justify-center">
                <div className="relative rounded shadow-md lg:w-1/3">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-search"></i>
                    </div>
                    <input onChange={handleChange} type="text" name="job" id="job" className="text-xl focus:ring-indigo-500 focus:border-indigo-250 block w-full py-2 pl-10 pr-15 border-gray-300 rounded-md" placeholder="Search a job..." />
                </div>
                <button className='buttonsearch shadow-md rounded mx-2 px-4 py-2 text-white text-xl font-bold bg-red-600 hover:bg-red-400 transition duration-500'>Search</button>
            </form>

            { 
            loading 
            ? <div className="loading w-full text-center mx-auto">Loading...</div>
            :
            <div className="joblist flex flex-col items-center justify-center">           
                {
                    jobList && jobList.length > 0 ?
                    <>
                    <h3 className="mt-6 text-xl">{jobList.length} result{jobList.length > 1 ?'s':'' }</h3>
                    {jobList.map((job) => {
                        return (
                            <div key={job.id} className="card bg-white rounded shadow-md sm:w-1/2 w-5/6 p-2 mx-auto mt-10 m-4 flex items-center justify-start">
                                <img className="image w-2/12 p-3" src={job.company_logo} alt={job.company_logo} />
                                <div className="description flex flex-col items-start justify-center p-3">
                                    <h2 className="font-bold">{job.title}</h2>
                                    <p>{job.company}</p>
                                    <p>{job.url}</p>
                                </div>
                            </div>
                        )
                    })}
                    </>
                    : ''
                }  
            </div>
            }
            
        </div>
    )
}