import React, { useState, useRef, useEffect } from 'react';
import { JobCard } from './JobCard';

export const Job = () => {
    
    const API_URL = 'https://jobs.github.com/positions.json?';
    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

    const [search, setSearch] = useState('');
    const [memoryjobList, setmemoryJobList] = useState();
    const [jobList, setJobList] = useState();
    const [filterActive, setFilterActive] = useState([]);
    const [loading, setLoading] = useState(false);

    const inputRef = useRef();
 
    const getJobs = async (search) => {
        try {
            setLoading(true);
            const rep = await fetch(PROXY_URL + API_URL + 'description=' + search, {
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    }
            });
            const result = await rep.json();
            setmemoryJobList(result);
            setJobList(result);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
            alert('Error fetching the API');
        }
    }

    const handleChange = (e) => {
        setSearch(e.target.value);
    }

    const handleSearch = (e) => {
        e.preventDefault();
        setFilterActive([]);
        if (search !== '') {
            getJobs(search);
            inputRef.current.value = ''; // On met le champs input vide
            setSearch('') // on remet le state search vide également
        } else {
            alert('You must type something !')
        }
    }

    const handleFilterButton = (e) => {
        const text = e.target.innerText;
        e.target.classList.toggle('active');
        if (e.target.classList.contains('active')) {   
            setFilterActive((array) => [...array, text]);
            e.target.innerText = 'X ' + text;
        } else {
            e.target.innerText = text.slice(1, text.length);
            setFilterActive(filterActive.filter((ele) => ele !== e.target.innerText));
        }
    }

    useEffect(() => {
        inputRef.current.focus();
        const handleFilterChange = () => {
            if (filterActive.length > 0) {
                setJobList([]);
                let filteredList = [...memoryjobList];
                filterActive.forEach((text) => {
                    filteredList = filteredList.filter((job) => {
                        return (
                            job.description.includes(text)
                            || job.title.includes(text)  
                            || job.description.includes(text.toLowerCase()) 
                            || job.title.includes(text.toLowerCase())
                        );
                        })
                    setJobList((job) => [...new Set([...job, ...filteredList])]);
                    }
                );
            }
        }
        setJobList(memoryjobList);
        handleFilterChange();
    }, [filterActive, memoryjobList])

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
                            <button onClick={handleFilterButton} 
                            className="bg-gray-200 hover:bg-gray-100 px-2 py-1 text-sm rounded-2xl mx-2 transition duration-200"
                            >
                            Senior
                            </button>
                            <button onClick={handleFilterButton}
                            className="bg-gray-200 hover:bg-gray-100 px-2 py-1 text-sm rounded-2xl mx-2 transition duration-200"
                            >
                            Junior
                            </button>
                            <button onClick={handleFilterButton}
                            className="bg-gray-200 hover:bg-gray-100 px-2 py-1 text-sm rounded-2xl mx-2 transition duration-200"
                            >
                            Full Stack
                            </button>
                            <button onClick={handleFilterButton}
                            className="bg-gray-200 hover:bg-gray-100 px-2 py-1 text-sm rounded-2xl mx-2 transition duration-200"
                            >
                            Frontend
                            </button>
                            <button onClick={handleFilterButton}
                            className="bg-gray-200 hover:bg-gray-100 px-2 py-1 text-sm rounded-2xl mx-2 transition duration-200"
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