import React from 'react'
import { memo, useState, useEffect } from 'react';
import {  Pie } from 'react-chartjs-2'; // Thêm Pie
import { Chart } from 'chart.js/auto';
const PieChart = () => {
    const [history, setHistory] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [voucherStatistics, setVoucherStatistics] = useState({});
  
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
          // Nếu mã voucher đã tồn tại, cộng thêm giá trị
          voucherStats[Voucher_ID].totalValue += TotalDiscount;
          voucherStats[Voucher_ID].count += 1;
        } else {
          // Nếu mã voucher chưa tồn tại, khởi tạo nó
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
    const pieChartData = {
      labels: [], // Các nhãn của biểu đồ tròn là Voucher_ID
      datasets: [
        {
          label: 'Tổng số tiền',
          data: [], // Dữ liệu của biểu đồ tròn là tổng giá trị (TotalDiscount)
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
          ], // Màu sắc cho các phần của biểu đồ
          hoverBackgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
          ]
        },
      ],
    };
  
    history.forEach(item => {
      const { Voucher_ID } = item;
  
      if (!uniqueVoucherIDs.has(Voucher_ID)) {
        uniqueVoucherIDs.add(Voucher_ID);
        pieChartData.labels.push(Voucher_ID);
        pieChartData.datasets[0].data.push(voucherStatistics[Voucher_ID]?.totalValue || 0);
      }
    });

    
  
    return (
      <>
        <div className=' lg:  w-full h-[290px]'>
        <Pie data={pieChartData} options={{
         responsive: true, // Đảm bảo biểu đồ phản hồi kích thước khung chứa
        }}  /> {/* Biểu đồ tròn Pie */}
        <div className="text-center mt-4">
        </div>
        </div>
      </>
    );
}

export default PieChart 
