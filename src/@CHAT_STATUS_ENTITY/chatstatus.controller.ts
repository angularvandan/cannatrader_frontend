import ChatStatus from "./chatstatus.model";

export const getChatsStatus=async(req:any,res:any)=>{

    let chatStatus=await ChatStatus.findByPk(req.params.id);
    
    res.status(200).send(chatStatus);
}