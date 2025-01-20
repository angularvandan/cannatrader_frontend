import Address from "./address.model";  

export const getAddressById=async(req:any,res:any)=>{
    let address=await Address.findByPk(req.prams.id);

    res.status(200).send(address);
}