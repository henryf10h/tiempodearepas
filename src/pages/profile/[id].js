// pages/profile/[id].js
import { useRouter } from 'next/router';
import Profile from '../components/Profile';
import Navbar from '../components/Navbar';

const ProfilePage = () => {
    const router = useRouter();
    const { id } = router.query;

    return (<>
        <Navbar/>
        <Profile id={id} />
        </>
    )
    
    
    
    
}
export default ProfilePage;