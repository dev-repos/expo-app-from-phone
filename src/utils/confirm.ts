import { Alert, Platform } from 'react-native';

type ConfirmOptions = {
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
};

// A destructive yes/no prompt. React Native Web's Alert ignores buttons, so web uses the browser dialog.
export function confirmDestructive({ title, message, confirmText, onConfirm }: ConfirmOptions) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: confirmText, style: 'destructive', onPress: onConfirm },
  ]);
}
