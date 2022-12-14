import { Button, ButtonGroup, SemanticFLOATS } from "semantic-ui-react";
import { IButtonData } from "../../layout/ReviewButtonData";

interface IProps {
    buttonData: IButtonData[],
    activeButton: string | null,
    handleReviewClick: (e: any) => void,
    float?: SemanticFLOATS | undefined,
    disabled?: boolean,
    loading: boolean
}

export const ReviewButtonsComponent: React.FC<IProps> = ({buttonData, activeButton, handleReviewClick, float, disabled , loading}) => {
    return (
        <ButtonGroup floated={float}>
            {buttonData.map(btn => {
                const className = activeButton === btn.name ? "active" : "";
                return (
                    <div key={btn.value}>
                        <Button
                        loading={activeButton === btn.name ? loading : false}
                        disabled={!!disabled ? disabled : false}
                        icon={{name: btn.icon, style: {pointerEvents: "none"}}}
                        className={`${className}`}
                        name={btn.name}
                        value={btn.value}
                        onClick={handleReviewClick}
                        />
                    </div>
                );
            })}
        </ButtonGroup>
    );
}