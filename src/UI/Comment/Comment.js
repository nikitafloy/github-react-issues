import React, { useEffect, useState } from 'react';
import './Comment.scss';
import utils from '../../utils';

export const Comment = props => {
    const [state, setState] = useState({items: []});
    useEffect(state => {
        const fetchData = async () => {
            const items = await Promise.all(props.items.map(async item => {
                const res = await utils.bodyToMarkdown(item.body);
                if (res) {
                    return {
                        created_at: item.created_at, 
                        user: {
                            login: item.user.login,
                            html_url: item.html_url,
                        }, 
                        body: res.data,
                    };
                } else {
                    console.error(res);
                    return setTimeout(props.globalProps.history.push, 5000, '/');
                };
            }));
            setState({...state, items});
        };
        fetchData();
    }, [props]);

    return state.items.length
        ? state.items.map((item, key) => (
            <section key={key} className="Comment">
                <div className="Comment__title">
                    <b><a href={item.user.html_url} target="_blank" rel="noopener noreferrer">{item.user.login}</a></b> оставил комментарий {utils.formatDate(item.created_at)}
                </div>

                <div className="Comment__body" dangerouslySetInnerHTML={{__html: item.body}}/>
            </section>
          ))
        : <section className="Comment">
            <div className="Comment__title">
                <div className="loading_100"/>
            </div>

            <div className="Comment__body">
                <div className="loading_100"/>
                <div className="loading_100"/>
                <div className="loading_100"/>
                <div className="loading_100"/>
            </div>
          </section>;
};