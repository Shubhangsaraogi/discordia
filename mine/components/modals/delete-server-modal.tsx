"use client";
import axios from "axios" 
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {useModal} from "@/hooks/use-modal-store"
import { useState } from "react";
import { useRouter } from "next/navigation";

export const DeleteServer  = () => {

    const {isOpen,onOpen, onClose, type,data}= useModal();

    const {server} =data;


    const isModalOpen = isOpen && type==="deleteServer";

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const onSubmit = async()=>{
        try {
            setIsLoading(true);
            await axios.delete(`/api/servers/${server?.id}`);
            onClose();
            router.refresh();    
        } catch (error) {
            console.log(error)
        }
        finally{
            setIsLoading(false);
        }
    }
    return (

        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Server  
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to do this? <br/> <span className="form-semidbold text-indigo-500"> {server?.name}</span> will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            variant="ghost"
                        >
                            Cancel 
                        </Button>
                        <Button
                            disabled={isLoading}
                            variant="primary"
                            onClick={onSubmit}
                        >
                            Confirm
                        </Button>
                        </div>   
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}




