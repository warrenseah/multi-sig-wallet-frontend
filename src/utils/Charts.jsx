import axios from "axios";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import "./graph.css"
const Ether_value_graph = () => {
    const [etherData, setEtherData] = useState("")
    const [series1, setSeries1] = useState("")
    const [series2, setSeries2] = useState("")
    const getData = () => {
        axios
            .get(
                "https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=30&sparkline=false",
            )
            .then((res) => {
                setEtherData(res.data.prices);
            });
    }
    function formatUSD(value, decimalPlaces = 2) {
        const formattedValue = parseFloat(value).toFixed(decimalPlaces);
        return '$' + formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    const data = {
        series: [
            {
                name: "series2",
                data: series2,
            },
        ],
        options: {
            chart: {
                height: 350,
                type: "area",
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "smooth",
            },
            xaxis: {
                axisBorder: {
                    show: false, // Hide the X-axis border
                },
                categories: [],
                labels: {
                    show: false
                }
            },
            yaxis: {
                axisBorder: {
                    show: false, // Hide the X-axis border
                },
                show: false,
                reversed: false,
                axisTicks: {
                    // show: true
                }
            },
            tooltip: {
                shared: false,
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                    return `
                    <div class="tooltip">
                    <div class="year-div">${series1[dataPointIndex]}</div>
                    <div class="price-div">
                        ${formatUSD(series2[dataPointIndex])}
                    </div></div >`;
                },
            },
            grid: {
                yaxis: {
                    lines: {
                        show: false
                    }
                },
                xaxis: {
                    lines: {
                        show: false
                    }
                }
            }


        },
    };
    useEffect(() => {
        getData()
    }, [])
    useEffect(() => {
        if (etherData) {
            let prices = [];
            let time = []
            console.log(etherData.length, "=====")
            etherData.map((item) => {
                prices.push(item[1].toFixed(2))
                const date = new Date(item[0]);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const hours = date.getHours();
                const minutes = date.getMinutes();
                time.push(`${day}-${month}-${year} ${hours}:${minutes}`)
            })
            setTimeout(() => {
                setSeries1(time)
                setSeries2(prices)
            }, 200)
        }
    }, [etherData])
    return (
        series1 && series2 ?
            <div id="chart">
                <ReactApexChart
                    options={data.options}
                    series={data.series}
                    type="area"
                    height={350}
                />
            </div>
            : ""
    );
};

export default Ether_value_graph;