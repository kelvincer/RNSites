import { Button, Dialog, Portal, Text } from "react-native-paper";

type ConfirmDialogProps = {
    visible: boolean;
    title: string;
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
};

export function ConfirmDialog({
    visible,
    title,
    message,
    onCancel,
    onConfirm,
}: ConfirmDialogProps) {
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onCancel}>
                <Dialog.Title>{title}</Dialog.Title>

                <Dialog.Content>
                    <Text>{message}</Text>
                </Dialog.Content>

                <Dialog.Actions>
                    <Button onPress={onCancel}>Cancelar</Button>
                    <Button onPress={onConfirm}>Aceptar</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}