import { useOutletContext } from "react-router-dom"
import { getComprador } from "../services/compradorServices"
import { useEffect } from "react"

function Dashboard (){
    
    const data = useOutletContext()
    const id = data.comprador.id

    useEffect(()=>{
        const obtenerComprador = async()=>{
            console.log("Useeffect")
            try {
                const data = await getComprador(id)
                console.log(data)
            } catch (error) {
                console.error(error)
            }
        }
        obtenerComprador()
    }, [])

    return(
        <>

        </>
    )
}

export default Dashboard