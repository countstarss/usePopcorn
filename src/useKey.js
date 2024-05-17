import { useEffect } from "react";


export function useKey(key,action) {
    // 检测按键
    useEffect(function () {
        const Escape = (e) => {
            //增加容错率
            if (e.code.toLowerCase() === key.toLowerCase()) {
                action();
                console.log(`${e.code} down`);
            }
        }

        document.addEventListener('keydown', Escape)
        // function cleanUp
        return function () {
            document.removeEventListener('keydown', Escape)
        }
    }, [key,action]);

}