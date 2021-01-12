import React, { useState, useRef, useEffect } from 'react';
import { JobCard } from './JobCard';

export const Job = () => {
    
    const API_URL = 'https://jobs.github.com/positions.json?';
    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

    const [search, setSearch] = useState('');
    const [memoryjobList, setmemoryJobList] = useState();
    const [jobList, setJobList] = useState();
    const [loading, setLoading] = useState(false);

    const inputRef = useRef();
 
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
        setmemoryJobList(result);
        setLoading(false);
    }

    const handleChange = (e) => {
        setSearch(e.target.value);
    }

    const handleSearch = (e) => {
        e.preventDefault();
        console.log(inputRef.current.value);
        getJobs(search);
        inputRef.current.value = ''; // On met le champs input vide
        setSearch('') // on remet le state search vide également
    }

    const filterList = (e) => {
        const text = e.target.value;
        e.target.classList.toggle('active');
        if (e.target.classList.contains('active')) {
            e.target.innerText = 'x' + text;
            const filteredList = jobList.filter((job) => {
                return (job.description.includes(e.target.innerText) === true || job.title.includes(e.target.innerText) === true);
            });
            setJobList(filteredList);
        } else {
            e.target.innerText = text;
            setJobList(memoryjobList);
        }
    }

    useEffect(() => {
        inputRef.current.focus();
    }, [])

    return (
        <div className="min-h-screen m-4">
            <h1 className="title text-3xl font-bold text-center w-full p-16">Job search</h1>
            
            <form onSubmit={handleSearch} className="inputsection pb-10 flex items-center justify-center">
                <div className="relative rounded shadow-md lg:w-1/3">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-search"></i>
                    </div>
                    <input ref={inputRef} onChange={handleChange} type="text" name="job" id="job" className="text-xl focus:ring-indigo-500 focus:border-indigo-250 block w-full py-2 pl-10 pr-15 border-gray-300 rounded-md" placeholder="Search a job..." />
                </div>
                <button className='buttonsearch shadow-md rounded mx-2 px-4 py-2 text-white text-xl font-bold bg-red-600 hover:bg-red-400 transition duration-500'>Search</button>
            </form>
            { 
                loading 
                ? <div className="loading w-full text-center mx-auto">Loading...</div>
                : <div className="joblist flex flex-col items-center justify-center">           
                    {
                        jobList && jobList.length >= 0 
                        ?
                        <>
                        <div className="tag">
                            <button onClick={filterList} 
                            className="bg-gray-200 hover:bg-gray-100 px-2 py-1 text-sm rounded mx-3 transition duration-200"
                            >
                            Fullstack
                            </button>
                            <button onClick={filterList}
                            className="bg-gray-200 hover:bg-gray-100 px-2 py-1 text-sm rounded mx-3 transition duration-200"
                            >
                            Frontend
                            </button>
                            <button onClick={filterList}
                            className="bg-gray-200 hover:bg-gray-100 px-2 py-1 text-sm rounded mx-3 transition duration-200"
                            >
                            Backend
                            </button>
                        </div>
                        <h3 className="mt-6 text-2xl">{jobList.length} result{jobList.length > 1 ?'s':'' }</h3>
                        {jobList.map((job) => {
                            return (
                                <JobCard job={job} key={job.id} />
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