import React, {useEffect, useState} from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles';
import HeadInfo from "./HeadInfo";
import axios from "axios";
import TESTING from "./TESTING";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));
export default function HeadToHeadComparison (props) {
    const [head1,setHead1]= useState('')
    const [head2,setHead2]= useState('')
    const [head1Bills, setHead1Bills] = useState([])
    const [head2Bills, setHead2Bills] = useState([])
    const [updated, setUpdated] = useState(false)
    const [dataSet, setDataSet] = useState([])


    const updateHead1 = (head)=>{
        console.log("executed!!")
        if(head === head1|| head === ''){
            setUpdated(false)
        }else{
            setUpdated(true)
            setDataSet([])
            setHead1(head)
            setHead1Bills([])

        }

    }

    const updateHead2 = (head)=>{
        if(head2 === head|| head === ''){
            setUpdated(false)
        }else{
            setUpdated(true)
            setHead2(head)
            setHead2Bills([])
            setDataSet([])

        }
    }

    useEffect( () => {
        async function getalldata(dataForHead1,dataForHead2) {
            let dataset={}
            console.log(dataForHead1)
            console.log(dataForHead2)
            let commonBillsCounter =0
            let similarities = 0
            for (let i = 0; i < dataForHead1.length; i++) {
                for (let j = 0; j < dataForHead2.length; j++) {
                    if (dataForHead1[i].voteRecord.bill === dataForHead2[j].voteRecord.bill) {
                        commonBillsCounter++
                        if(dataForHead1[i].voteRecord.yea === dataForHead2[j].voteRecord.yea) {
                        similarities++
                    }
                }
            }
            }

            console.log('the similarities % !!!!!!!!' + (similarities / (commonBillsCounter)) * 100+ " %")
            let final = (similarities / (commonBillsCounter))*100
            dataset = {
                lower: calcPercent(0),
                upper: calcPercent(final)
            }
            return [dataset,final]

        }
        console.log('Head 1 IS '+ head1)

        async function getBills() {
            const head1Bills = await getAllBillsByHead(head1, 'head1')
            const head2Bills = await getAllBillsByHead(head2, 'head2')
            const dataset = await getalldata(head1Bills, head2Bills)
            setDataSet(dataset)
        }

        if(head1 != '' && head2 != '' ) {
            getBills()
        }
        console.log('the dataset is ready '+ dataSet)

    }, [head1, head2])


    return (
        <div>
            <Grid   container
                    spacing={10}
                    direction="row"
                    alignItems="center"
                    justify="center"
                    style={{ minHeight: '100vh' }}>
                <Grid item={1}>
                    <HeadInfo updateHead={updateHead1}/>
                </Grid>
                <Grid item={1}>
                    <HeadInfo updateHead={updateHead2}/>
                </Grid>
            </Grid>

            <Grid container  alignItems="center">
                <Grid item={1} xs={12}>
                    { dataSet.length ?
                        <TESTING data={dataSet}/>
                        : "   DO  NOTHING!!"}
                </Grid>
            </Grid>

        </div>

    )

    function calcPercent(percent) {
        return [percent, 100 - percent];
    }

}
export async function getAllBillsByHead (head,type) {
    const res = await axios.get(`http://localhost:5000/api/bills/${head}/getAllBillsByHead`)
    return res.data.data
}