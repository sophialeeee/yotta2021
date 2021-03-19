import React from 'react';
import StatisticsCard from "../../../components/StatisticsCard";
import {BookOutlined, DatabaseOutlined, ProfileOutlined, ReadOutlined} from "@ant-design/icons";

function Statistic(props) {
    const {statistics} = props;
    return (
        <>
            <StatisticsCard icon={<DatabaseOutlined/>} title={'学科'} value={statistics.subject}
                            color={'#66bb6a'}/>
            <StatisticsCard icon={<BookOutlined/>} title={'课程'} value={statistics.domain} color={'#ec407a'}/>
            <StatisticsCard icon={<ReadOutlined/>} title={'知识主题'} value={statistics.topic}
                            color={'#26c6da'}></StatisticsCard>
            <StatisticsCard icon={<ProfileOutlined/>} title={'知识碎片'} value={statistics.assemble}
                            color={'#ffa726'}></StatisticsCard>
        </>
    );
}
export default Statistic;
