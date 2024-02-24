const Authlayout = ({children}:{children:React.ReactNode}) => {
    return ( 
        <div className="bg-red-700 flex flex-row text-red-50">
            {children}
        </div>
     );
}
 
export default Authlayout;