import { useState, useEffect } from 'react'

export function useLocalStorageState(initialState, storageKey) {
    //加载本地存储的 watched
    //方法是将watched的初始值换成一个回调函数,回调函数最后返回一个字符串
    //因为添加本地存储的effct和handleAddWatched分开了,所以每次存储的watched都是最新的,直接通过getItem()获取watched
    const [value, setValue] = useState(function () {
        const storedValue = localStorage.getItem(storageKey);
        return storedValue ? JSON.parse(storedValue) : initialState;
    });

    // 新内容
    // 添加本地存储
    useEffect(function () {
        // 添加本地存储
        localStorage.setItem(storageKey, JSON.stringify(value))
    }, [value, storageKey])

    return [ value, setValue ];
}
