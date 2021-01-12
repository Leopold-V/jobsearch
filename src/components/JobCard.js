export const JobCard = ({job}) => {
    return (
        <div className="card bg-white rounded shadow-md sm:w-1/2 w-5/6 p-2 mx-auto mt-10 m-4 flex items-center justify-start">
            <img className="image w-2/12 p-3" src={job.company_logo} alt={job.company_logo} />
            <div className="description flex flex-col items-start justify-center p-3">
                <h2 className="font-bold">{job.title}</h2>
                <p>{job.company}</p>
                <p>{job.url}</p>
            </div>
        </div>
    )
}