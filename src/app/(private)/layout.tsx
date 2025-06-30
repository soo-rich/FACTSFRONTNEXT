import AuthGuard from "@/components/auth/AuthGuard"
import { ChildrenType } from "@/types/types"

const PrivateLayout = ({ children }: ChildrenType) => {
    return <AuthGuard>
        {children}
    </AuthGuard>
}

export default PrivateLayout