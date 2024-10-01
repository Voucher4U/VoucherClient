import PieChart from "./PieChart"
import ChartVoucher from "./ChartVoucher"
import TopListVoucher from "./TopListVoucher"

const Statistical = () => {
  return (
    <div>
        <TopListVoucher className=" bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md"/>
        <div className=" grid grid-cols-4 gap-0">
            <div className=" col-span-3  bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                <ChartVoucher />
            </div>
            <div className="  justify-self-end bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md-black">
                <PieChart />
            </div>
        </div>
    </div>
  )
}

export default Statistical
