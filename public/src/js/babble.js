const { useEffect, useRef } = React

function App(){
    const ref = useRef(null)

    useEffect(() => {
        const c = ref.current
        const x = c.getContext("2d")

        const resize = () => {
            c.width = innerWidth
            c.height = innerHeight
        }
        resize()
        window.addEventListener("resize", resize)

        const stars = Array.from({length:150},() => ({
            x:Math.random()*innerWidth,
            y:Math.random()*innerHeight,
            r:Math.random()*1.6+.4,
            o:Math.random(),
            d:(Math.random()-.5)*.02
        }))

        const snow = Array.from({length:380},() => ({
            x:Math.random()*innerWidth,
            y:Math.random()*innerHeight,
            s:Math.random()+.4
        }))

        const draw = () => {
            x.clearRect(0,0,c.width,c.height)

            stars.forEach(s=>{
                s.o+=s.d
                if(s.o<.2||s.o>1)s.d*=-1
                x.beginPath()
                x.arc(s.x,s.y,s.r,0,Math.PI*2)
                x.fillStyle=`rgba(255,255,255,${s.o})`
                x.fill()
            })

            snow.forEach(f=>{
                f.y+=f.s
                if(f.y>c.height)f.y=-5
                x.beginPath()
                x.arc(f.x,f.y,2,0,Math.PI*2)
                x.fillStyle="rgba(255,255,255,.6)"
                x.fill()
            })

            requestAnimationFrame(draw)
        }
        draw()
    },[])

    return <canvas ref={ref} className="fixed inset-0"/>
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>)