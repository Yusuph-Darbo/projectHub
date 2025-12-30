import './Header.css'

export default function Header (props) {
    return (
        <header>
            <div className="left">
                {props.showBack && <button>←</button>}
                <div>
                    <h1>{props.title}</h1>
                    {props.subtitle && <p>{props.subtitle}</p>}
                </div>
            </div>

            <div className="right">
                {props.action}
            </div>
        </header>
    )
}