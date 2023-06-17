import { SlLike, SlDislike } from "react-icons/sl";

function LikeBar(props: any) {
    return (
        <div className='like-bar'>
            <button className='like-button'>
                <SlLike />
            </button>

            <p className='like-count'>{props.likes}</p>

            <button className='dislike-button'>
                <SlDislike />
            </button>
        </div>
    );

}
export default LikeBar;
