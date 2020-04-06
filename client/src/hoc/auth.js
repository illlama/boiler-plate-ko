import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function (SpecificComponent, option, adminRoute = null) {
    // SpecificComponent : 랜딩할 페이지
    // option => null: 아무나 / true: 로그인한 사람만 / false: 로그인 한 유저는 출입 불가
    // adminRoute 는 true로 해두면 어드민만 들어올수있음 기본값 null로 해둠
    const AuthenticationCheck = (props) => {
        const dispatch = useDispatch();
        useEffect(() => {
            dispatch(auth()).then((response) => {
                console.log('response auth:', response);
                //로그인 하지 않은 상태
                if (!response.payload.isAuth) {
                    if (option) {
                        props.history.push('/login');
                    }
                } else {
                    //로그인 한 상태
                    if (adminRoute && !response.payload.isAuth) {
                        //어드민이 아닌데 어드민만 접근 가능한 페이지에 접속하려할때
                        props.history.push('/');
                    } else {
                        if (!option) {
                            props.history.push('/');
                        }
                    }
                }
            });
        }, []);
        return <SpecificComponent />;
    };

    return AuthenticationCheck;
}
