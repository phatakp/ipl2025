"use client";

import * as React from "react";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

interface ModalContextType {
    isOpen: boolean;
    modalId: string;
    closeModal: (id: string) => void;
}

const ModalContext = React.createContext<ModalContextType>(
    {} as ModalContextType
);

interface BaseProps {
    children: React.ReactNode;
}

interface RootModalProps extends BaseProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    id: string;
}

interface ModalProps extends BaseProps {
    className?: string;
    asChild?: true;
}

const desktop = "(min-width: 768px)";

const useModal = () => {
    const context = React.useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};

const Modal = ({
    children,
    id,
    open,
    onOpenChange,
    ...props
}: RootModalProps) => {
    const [modalId] = React.useState(id);
    const [isOpen, setIsOpen] = React.useState(!!open);
    const isDesktop = useMediaQuery(desktop);
    const closeModal = (id: string) => {
        if (modalId === id) setIsOpen(false);
    };
    const Modal = isDesktop ? Dialog : Drawer;

    return (
        <ModalContext.Provider value={{ modalId, closeModal, isOpen }}>
            <Modal open={isOpen} onOpenChange={setIsOpen} {...props}>
                {children}
            </Modal>
        </ModalContext.Provider>
    );
};

const ModalTrigger = ({ className, children, ...props }: ModalProps) => {
    const isDesktop = useMediaQuery(desktop);
    const ModalTrigger = isDesktop ? DialogTrigger : DrawerTrigger;

    return (
        <ModalTrigger className={className} {...props}>
            {children}
        </ModalTrigger>
    );
};

const ModalClose = ({ className, children, ...props }: ModalProps) => {
    const isDesktop = useMediaQuery(desktop);
    const ModalClose = isDesktop ? DialogClose : DrawerClose;
    const { modalId, closeModal } = useModal();

    return (
        <ModalClose
            className={cn("uppercase", className)}
            onClick={() => closeModal(modalId)}
            {...props}
        >
            {children}
        </ModalClose>
    );
};

const ModalContent = ({ className, children, ...props }: ModalProps) => {
    const isDesktop = useMediaQuery(desktop);
    const ModalContent = isDesktop ? DialogContent : DrawerContent;

    return (
        <ModalContent
            className={cn(
                "max-h-[calc(90dvh-1.5rem)] sm:w-[calc(100dvw-1.5rem)]",
                className
            )}
            {...props}
        >
            <ScrollArea className="max-h-[calc(90dvh-3rem)]">
                {children}
            </ScrollArea>
        </ModalContent>
    );
};

const ModalDescription = ({ className, children, ...props }: ModalProps) => {
    const isDesktop = useMediaQuery(desktop);
    const ModalDescription = isDesktop ? DialogDescription : DrawerDescription;

    return (
        <ModalDescription className={cn("font-karla", className)} {...props}>
            {children}
        </ModalDescription>
    );
};

const ModalHeader = ({ className, children, ...props }: ModalProps) => {
    const isDesktop = useMediaQuery(desktop);
    const ModalHeader = isDesktop ? DialogHeader : DrawerHeader;

    return (
        <ModalHeader className={cn(className)} {...props}>
            {children}
        </ModalHeader>
    );
};

const ModalTitle = ({ className, children, ...props }: ModalProps) => {
    const isDesktop = useMediaQuery(desktop);
    const ModalTitle = isDesktop ? DialogTitle : DrawerTitle;

    return (
        <ModalTitle
            className={cn("font-normal uppercase", className)}
            {...props}
        >
            {children}
        </ModalTitle>
    );
};

const ModalBody = ({ className, children, ...props }: ModalProps) => {
    return (
        <div className={cn("px-4 md:px-0", className)} {...props}>
            {children}
        </div>
    );
};

const ModalFooter = ({ className, children, ...props }: ModalProps) => {
    const isDesktop = useMediaQuery(desktop);
    const ModalFooter = isDesktop ? DialogFooter : DrawerFooter;

    return (
        <ModalFooter className={className} {...props}>
            {children}
        </ModalFooter>
    );
};

export {
    Modal,
    ModalBody,
    ModalClose,
    ModalContent,
    ModalDescription,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    ModalTrigger,
    useModal,
};
