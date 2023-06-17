import { Navigate } from "react-router-dom";

function ProtectedRoute(props: { redirectPath?: string | '/login', children: any, fromAuth?: boolean } ) {
    if (!localStorage.getItem('name')) {
        if (!props.fromAuth) {
            return <Navigate to='/login' replace />;
        }
    }
    
    if (localStorage.getItem('name')) {
        if (props.fromAuth)
            return <Navigate to='/' replace />;
    }

    return props.children;
}

export default ProtectedRoute;
