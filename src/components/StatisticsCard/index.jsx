import React from 'react';
import {Card} from "antd";

import classes from './index.module.css';

function StatisticsCard(props) {
    const {icon, title, value, color} = props;
    return (
        <div className={classes.card}>
            <Card
                title={
                    <div className={classes.wrapper}>
                        <span className={classes.icon} style={{backgroundColor: color}}>
                            {icon}
                        </span>
                        <div className={classes.data}>
                            <p>{title}</p>
                            <h3>{value}</h3>
                        </div>
                    </div>

                }
                bordered={true}
                hoverable={false}
                bodyStyle={{display: 'none'}}
                headStyle={{paddingLeft: '0px'}}>
                

            </Card>
        </div>

    );
}

export default StatisticsCard;
