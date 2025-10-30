import { createAsyncThunk } from '@reduxjs/toolkit'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../../firebase'

const getDataFromDb = createAsyncThunk(
    'products/getData',
    async () => {
        try {
            const querySnapShot = await getDocs(collection(db, 'products'))
            const products = querySnapShot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data()
                }
            })
            return products
        } catch (e) {
            console.log(e)
        }
    }
)
export default getDataFromDb