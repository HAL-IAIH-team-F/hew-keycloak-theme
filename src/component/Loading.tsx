import {useEffect, useState} from "react";

const loadingMaxCnt = 50
const loadingCntTime = 400

function getCnt() {
  return (Date.now() % (loadingCntTime * loadingMaxCnt * 2)) / loadingCntTime
}

function getList() {
  const cnt = getCnt()
  const result: boolean[] = []
  const base = cnt < loadingMaxCnt
  const position = cnt % loadingMaxCnt

  for (let i = 0; i < loadingMaxCnt; i++) {
    result.push(i < position ? base : !base)
  }
  return result
}

export default function Loading(
  {
    ...props
  }: LoadingProps,
) {
  const [loadingIcon, setLoadingIcon] = useState<boolean[]>(getList)


  useEffect(() => {
    const timeout = setInterval(() => {
      setLoadingIcon(getList())
    }, loadingCntTime)

    return () => {
      clearInterval(timeout)
    }
  }, []);

  return (
    <div {...props}
         style={{
           background: "#4be5fc",
           position: "fixed",
           width: "100%",
           height: "100%",
           left: 0,
           top: 0,
           zIndex: 100,
         }}
    >
      <div style={{}}
      >
        <div style={{
          height: "30px"
        }}>
          <p style={{
            color: "white",
            textAlign: "center",
            fontSize: "1rem",
          }}>
            loading...
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {loadingIcon.map((value, index) =>
            <div
              style={{
                height: "10px",
                width: "10px",
                borderRadius: "10px",
                margin: "0 10px",
                background: value ? "gray" : "white"
              }}
              key={index}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export interface LoadingProps {
}

 