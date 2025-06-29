import {ChildrenType} from "@/types/types";
import AuthGuard from "@/components/auth/AuthGuard";

const layoutAdmin = ({children}:ChildrenType) => {

    return <AuthGuard>{children}</AuthGuard>
}

export default layoutAdmin;