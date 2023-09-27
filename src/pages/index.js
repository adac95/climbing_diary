import { ImageTest } from "@components/ImageTest";
import Link from "next/link";

export default function Home() {
  return (
    <div >
      <h1>hola</h1>
      <Link href={'/topos'} ><p style={{display:"block", border:"1px black line",width: '200px', color: 'green', height:'40px', textAlign:"center", background:'#ff002343',fontSize:"18px"}}>Topos</p></Link>
      <Link href={'/topos'} ><p style={{display:"block", border:"1px black line",width: '200px', color: 'green', height:'40px', textAlign:"center", background:'#ff002343',fontSize:"18px"}}>Diario</p></Link>
      <ImageTest/>
    </div>
  )
}
