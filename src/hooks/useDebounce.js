function useDebounce(cb, delay = 500){
    let timerId;

return (...agruments)=>{
        clearTimeout(timerId);
        timerId = setTimeout(()=>{
            cb(...agruments);
        }, delay);
}
}

export default useDebounce;