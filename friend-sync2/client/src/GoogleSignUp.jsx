import AuthService from "./Authentication/AuthService";
import { useNavigate} from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from "axios";

function GoogleSignUp() {
  const navigate = useNavigate();

  const signUp = useGoogleLogin({
    onSuccess: async (response) => {
      try{
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            }
          },
        )
        console.log(res.data.email);
        await AuthService.googleSignIn(res.data.email);
        navigate('/homepage')
      }catch(err){
        console.log(err)
      }
    }
  });
  
  return(
    <div>
      <button onClick={() => signUp()}>Sign up with Google </button>
    </div>
  )
}

export default GoogleSignUp;
