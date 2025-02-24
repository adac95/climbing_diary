import Image from "next/image";
import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <form>
      <Image
        src={
          "https://hcegmotvdidgavvacgcy.supabase.co/storage/v1/object/public/topo_pictures/IMG_3725.jpg"
        }
        width={300}
        height={100}
      />
      <label htmlFor='email'>Email:</label>

      <input id='email' name='email' type='email' required />
      <label htmlFor='password'>Password:</label>

      <input id='password' name='password' type='password' required />
      <button formAction={login}>Log in</button>

      <button formAction={signup}>Sign up</button>
    </form>
  );
}
