import {Circle} from 'better-react-spinkit';
import Image from 'next/image';

export default function Loading() {
    return (
        <center style={{display: 'grid', placeItems: 'center', height:'100vh'}}>
            <div>

                <Image 
                    src="/logo.png"  
                    alt = 'logo' 
                    style = {{marginBottom: 20}}
                    layout = 'fill'
                />
                <Circle size={40} />

            </div>
        </center>
    )
}
