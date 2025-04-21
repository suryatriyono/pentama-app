import Swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";

// Interface untuk tema
interface ModernAlertThemeType {
  colors: {
    primary: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    text: string;
    textLight: string;
    background: string;
    [key: string]: string;
  };
  fonts: {
    main: string;
    [key: string]: string;
  };
  borderRadius: string;
  boxShadow: string;
  [key: string]: any;
}

// Interface untuk props yang diterima oleh fungsi alert
interface ModernAlertProps {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  showCloseButton?: boolean;
  allowOutsideClick?: boolean;
  timer?: number;
  icon?: "success" | "error" | "warning" | "info" | "question";
  customOptions?: SweetAlertOptions;
  onConfirm?: () => void;
}

// Tema dasar untuk ModernAlert yang bisa disesuaikan
const ModernAlertTheme: ModernAlertThemeType = {
  colors: {
    primary: "#4F46E5", // Indigo-600
    success: "#10B981", // Emerald-500
    error: "#EF4444",   // Red-500
    warning: "#F59E0B", // Amber-500
    info: "#3B82F6",    // Blue-500
    text: "#1F2937",    // Gray-800
    textLight: "#F9FAFB", // Gray-50
    background: "#FFFFFF",
  },
  fonts: {
    main: "Inter, system-ui, sans-serif",
  },
  borderRadius: "0.75rem",
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
};

// Inisialisasi SweetAlert dengan konfigurasi default
Swal.mixin({
  customClass: {
    container: "modern-alert-container",
    popup: "modern-alert-popup",
    title: "modern-alert-title",
    htmlContainer: "modern-alert-content",
    confirmButton: "modern-alert-confirm-btn",
    cancelButton: "modern-alert-cancel-btn",
    denyButton: "modern-alert-deny-btn",
    icon: "modern-alert-icon",
  },
  buttonsStyling: false,
  focusConfirm: false,
  showCloseButton: false, // Tidak menampilkan tombol "x"
  allowOutsideClick: true, // Mengizinkan klik di luar dialog untuk menutup
});

// Tambahkan CSS custom ke dokumen
const injectStyles = (): void => {
  const styleId = "modern-alert-styles";
  if (document.getElementById(styleId)) return;

  const style = document.createElement("style");
  style.id = styleId;
  style.innerHTML = `
    .modern-alert-container {
      z-index: 9999;
      backdrop-filter: blur(5px);
    }
    
    .modern-alert-popup {
      border-radius: ${ModernAlertTheme.borderRadius};
      box-shadow: ${ModernAlertTheme.boxShadow};
      padding: 1.5rem;
      font-family: ${ModernAlertTheme.fonts.main};
    }
    
    .modern-alert-title {
      color: ${ModernAlertTheme.colors.text};
      font-weight: 600;
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }
    
    .modern-alert-content {
      color: ${ModernAlertTheme.colors.text};
      opacity: 0.9;
      font-size: 1rem;
      margin-top: 0.5rem;
      margin-bottom: 1.25rem;
    }
    
    .modern-alert-confirm-btn {
      background: ${ModernAlertTheme.colors.primary};
      color: ${ModernAlertTheme.colors.textLight};
      border-radius: 0.5rem;
      font-weight: 500;
      padding: 0.625rem 1.25rem;
      border: none;
      transition: all 0.2s ease;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    .modern-alert-confirm-btn:hover {
      background: ${ModernAlertTheme.colors.primary}dd;
      transform: translateY(-1px);
    }
    
    .modern-alert-confirm-btn:active {
      transform: translateY(0);
    }
    
    .modern-alert-cancel-btn {
      background: #E5E7EB;
      color: ${ModernAlertTheme.colors.text};
      border-radius: 0.5rem;
      font-weight: 500;
      padding: 0.625rem 1.25rem;
      border: none;
      transition: all 0.2s ease;
      margin-right: 0.75rem;
    }
    
    .modern-alert-cancel-btn:hover {
      background: #D1D5DB;
    }
    
    .modern-alert-icon {
      border: none !important;
      box-shadow: none !important;
      margin-bottom: 1rem;
    }
    
    /* Alert Types */
    .swal2-icon.swal2-success {
      border-color: ${ModernAlertTheme.colors.success} !important;
      color: ${ModernAlertTheme.colors.success} !important;
    }
    
    .swal2-icon.swal2-error {
      border-color: ${ModernAlertTheme.colors.error} !important;
      color: ${ModernAlertTheme.colors.error} !important;
    }
    
    .swal2-icon.swal2-warning {
      border-color: ${ModernAlertTheme.colors.warning} !important;
      color: ${ModernAlertTheme.colors.warning} !important;
    }
    
    .swal2-icon.swal2-info {
      border-color: ${ModernAlertTheme.colors.info} !important;
      color: ${ModernAlertTheme.colors.info} !important;
    }
    
    .swal2-success-ring {
      background-color: ${ModernAlertTheme.colors.success}33 !important;
    }
    
    .swal2-success-line-tip,
    .swal2-success-line-long {
      background-color: ${ModernAlertTheme.colors.success} !important;
    }
    
    .swal2-loader {
      border-color: ${ModernAlertTheme.colors.primary} transparent ${ModernAlertTheme.colors.primary} transparent;
    }
  `;
  document.head.appendChild(style);
};

// API untuk ModernAlert
const ModernAlert = {
  // Sesuaikan tema warna
  setTheme: (theme: Partial<ModernAlertThemeType>): void => {
    Object.assign(ModernAlertTheme, theme);
    injectStyles();
  },

  // Tampilkan pesan success
  success: async (props: ModernAlertProps): Promise<SweetAlertResult> => {
    injectStyles();
    const customOptions: SweetAlertOptions = props.customOptions
      ? {
        ...props.customOptions,
        preConfirm: props.onConfirm
      }
      : props.customOptions || {};
    return Swal.fire({
      title: props.title || "Success!",
      text: props.description,
      icon: "success",
      confirmButtonText: props.confirmLabel || "OK",
      showCancelButton: !!props.cancelLabel,
      cancelButtonText: props.cancelLabel || "Cancel",
      showCloseButton: props.showCloseButton || false,
      allowOutsideClick: props.allowOutsideClick !== false,
      timer: props.timer || undefined,
      timerProgressBar: !!props.timer,
      ...props.customOptions,
    });
  },

  // Tampilkan pesan error
  error: async (props: ModernAlertProps): Promise<SweetAlertResult> => {
    injectStyles();
    return Swal.fire({
      title: props.title || "Failed!",
      text: props.description,
      icon: "error",
      confirmButtonText: props.confirmLabel || "OK",
      showCancelButton: !!props.cancelLabel,
      cancelButtonText: props.cancelLabel || "Cancel",
      showCloseButton: props.showCloseButton || false,
      allowOutsideClick: props.allowOutsideClick !== false,
      ...props.customOptions,
    });
  },

  // Tampilkan pesan warning
  warning: async (props: ModernAlertProps): Promise<SweetAlertResult> => {
    injectStyles();
    return Swal.fire({
      title: props.title || "Attention!",
      text: props.description,
      icon: "warning",
      confirmButtonText: props.confirmLabel || "OK",
      showCancelButton: !!props.cancelLabel,
      cancelButtonText: props.cancelLabel || "Cancel",
      showCloseButton: props.showCloseButton || false,
      allowOutsideClick: props.allowOutsideClick !== false,
      ...props.customOptions,
    });
  },

  // Tampilkan pesan info
  info: async (props: ModernAlertProps): Promise<SweetAlertResult> => {
    injectStyles();
    return Swal.fire({
      title: props.title || "Information",
      text: props.description,
      icon: "info",
      confirmButtonText: props.confirmLabel || "OK",
      showCancelButton: !!props.cancelLabel,
      cancelButtonText: props.cancelLabel || "Cancel",
      showCloseButton: props.showCloseButton || false,
      allowOutsideClick: props.allowOutsideClick !== false,
      ...props.customOptions,
    });
  },

  // Tampilkan konfirmasi
  confirm: async (props: ModernAlertProps): Promise<SweetAlertResult> => {
    injectStyles();
    return Swal.fire({
      title: props.title || "Confirmation",
      text: props.description,
      icon: props.icon || "question",
      showCancelButton: true,
      confirmButtonText: props.confirmLabel || "Yes",
      cancelButtonText: props.cancelLabel || "No",
      showCloseButton: props.showCloseButton || false,
      allowOutsideClick: props.allowOutsideClick !== false,
      ...props.customOptions,
    });
  },

  // Tampilkan loading
  loading: (props?: ModernAlertProps): void => {
    injectStyles();
    Swal.fire({
      title: props?.title || "Processiong...",
      text: props?.description || "Palse wait a moment",
      allowOutsideClick: false, // Loading tidak bisa ditutup dengan klik di luar
      didOpen: () => {
        Swal.showLoading();
      },
      showConfirmButton: false,
      showCancelButton: false,
      showCloseButton: false,
    });
  },

  // Tutup alert
  close: (): void => {
    Swal.close();
  }
};

export default ModernAlert;
