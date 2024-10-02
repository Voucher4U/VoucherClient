import { memo, useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2'; // Giữ nguyên Line
import { Chart } from 'chart.js/auto';

const ChartVoucher = () => {
  const [selectedMonth, setSelectedMonth] = useState(''); // Lưu tháng được chọn
  const [selectedYear, setSelectedYear] = useState('');   // Lưu năm được chọn
  const [history, setHistory] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [voucherStatistics, setVoucherStatistics] = useState({});
  const [filteredData, setFilteredData] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('https://server-voucher.vercel.app/api/Statistical_Voucher');
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await res.json();
      setHistory(data);
      console.log(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const calculateVoucherStatistics = (history) => {
    const voucherStats = {};

    history.forEach(item => {
      const { Voucher_ID, TotalDiscount } = item;

      if (voucherStats[Voucher_ID]) {
        voucherStats[Voucher_ID].totalValue += TotalDiscount;
        voucherStats[Voucher_ID].count += 1;
      } else {
        voucherStats[Voucher_ID] = {
          totalValue: TotalDiscount,
          count: 1,
        };
      }
    });

    return voucherStats;
  };

  useEffect(() => {
    if (history) {
      const stats = calculateVoucherStatistics(history);
      setVoucherStatistics(stats);
      console.log(stats);
    }
  }, [history]);

  const handleMonthChange = (e) => {
    selectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    selectedYear(e.target.value);
  }

  const filterDataByMonthAndYear = () =>{{
    if(!selectedMonth || !selectedYear || history.length) return ;

    const filtered = history.filter(item => {
      const voucherDate = new Date(item.Date);
      return(
        voucherDate.getMonth() +1 === parseInt(selectedMonth) &&
        voucherDate.getFullYear() === parseInt(selectedYear)
      )
    })
    setFilteredData(filtered);
  }}

  // Khi người dùng nhấn nút tìm kiếm
  const handleSearch = () => {
    filterDataByMonthAndYear(); // Lọc dữ liệu dựa vào tháng và năm
};

  if (isLoading) {
    return (
      <div className="text-center text-4xl translate-y-1/2 h-full font-extrabold">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-4xl translate-y-1/2 h-full font-extrabold">
        Error: {error}
      </div>
    );
  }

  if (!history || history.length === 0) return <div>No data available.</div>;

  const uniqueVoucherIDs = new Set();
  const chartData = {
    labels: [],
    datasets: [
      {
        label: 'Số lượng Voucher',
        data: [],
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  history.forEach(item => {
    const { Voucher_ID } = item;

    if (!uniqueVoucherIDs.has(Voucher_ID)) {
      uniqueVoucherIDs.add(Voucher_ID);
      chartData.labels.push(Voucher_ID);
      chartData.datasets[0].data.push(voucherStatistics[Voucher_ID]?.count || 0);
    }
  });

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true, // Bắt đầu trục Y từ 0
      },
    },
    maintainAspectRatio: false, // Vô hiệu hóa tỷ lệ cố định, cho phép thay đổi kích thước
  };
  
  return (
    <div className=' xl:w-full  h-[300px]'> {/* Điều chỉnh kích thước container */}
    <select value={selectedMonth} onChange={handleMonthChange} >
      <option value="">Chọn tháng muốn thống kê</option>
      <option value="1">Tháng 1</option>
      <option value="2">Tháng 2</option>
      <option value="3">Tháng 3</option>
      <option value="4">Tháng 4</option>
      <option value="5">Tháng 5</option>
      <option value="6">Tháng 6</option>
      <option value="7">Tháng 7</option>
      <option value="8">Tháng 8</option>
      <option value="9">Tháng 9</option>
      <option value="10">Tháng 10</option>
      <option value="11">Tháng 11</option>
      <option value="12">Tháng 12</option>
    </select>

    <select  value={selectedYear} onChange={handleYearChange}>
      <option value=""> Chọn năm</option>
      <option value="2021">2021</option>
      <option value="2022">2022</option>
      <option value="2023">2023</option>
      <option value="2024">2024</option>
    </select>

    <button onClick={handleSearch} disabled={!selectedMonth || !selectedYear}> Tìm kiếm</button>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default memo(ChartVoucher);
