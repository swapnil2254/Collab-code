import useLocalStorage from "@/hooks/useLocalStorage"
import {
    Settings,
    SettingsContext as SettingsContextType,
} from "@/types/setting"
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"

const SettingContext = createContext<SettingsContextType | null>(null)

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingContext)
    if (!context) {
        throw new Error(
            "useSettings must be used within a SettingContextProvider",
        )
    }
    return context
}

const defaultSettings: Settings = {
    theme: "Basic Light",
    language: "javascript",
    fontSize: 16,
    fontFamily: "Space Mono",
    showGitHubCorner: true,
    isSettingsModified: false,
    appTheme: "light",
}

function SettingContextProvider({ children }: { children: ReactNode }) {
    const { getItem } = useLocalStorage()
    const storedSettings: Partial<Settings> = JSON.parse(
        getItem("settings") || "{}",
    )
    const storedTheme =
        storedSettings.theme !== undefined
            ? storedSettings.theme
            : defaultSettings.theme
    const storedLanguage =
        storedSettings.language !== undefined
            ? storedSettings.language
            : defaultSettings.language
    const storedFontSize =
        storedSettings.fontSize !== undefined
            ? storedSettings.fontSize
            : defaultSettings.fontSize
    const storedFontFamily =
        storedSettings.fontFamily !== undefined
            ? storedSettings.fontFamily
            : defaultSettings.fontFamily
    const storedShowGitHubCorner =
        storedSettings.showGitHubCorner !== undefined
            ? storedSettings.showGitHubCorner
            : defaultSettings.showGitHubCorner
    const storedIsSettingsModified =
        storedSettings.isSettingsModified !== undefined
            ? storedSettings.isSettingsModified
            : defaultSettings.isSettingsModified
    const storedAppTheme =
        storedSettings.appTheme !== undefined
            ? storedSettings.appTheme
            : defaultSettings.appTheme

    const [theme, setTheme] = useState<string>(storedTheme)
    const [language, setLanguage] = useState<string>(storedLanguage)
    const [fontSize, setFontSize] = useState<number>(storedFontSize)
    const [fontFamily, setFontFamily] = useState<string>(storedFontFamily)
    const [showGitHubCorner, setShowGitHubCorner] = useState<boolean>(
        storedShowGitHubCorner,
    )
    const [isSettingsModified, setIsSettingsModified] = useState<boolean>(
        storedIsSettingsModified,
    )
    const [appTheme, setAppTheme] = useState<string>(storedAppTheme)

    const resetSettings = () => {
        setTheme(defaultSettings.theme)
        setLanguage(defaultSettings.language)
        setFontSize(defaultSettings.fontSize)
        setFontFamily(defaultSettings.fontFamily)
        setShowGitHubCorner(defaultSettings.showGitHubCorner)
        setIsSettingsModified(defaultSettings.isSettingsModified)
        setAppTheme(defaultSettings.appTheme)

        console.log("default-settings,", defaultSettings)
    }

    useEffect(() => {
        // Save settings to local storage whenever they change
        const updatedSettings = {
            theme,
            language,
            fontSize,
            fontFamily,
            showGitHubCorner,
            isSettingsModified,
            appTheme,
        }
        localStorage.setItem("settings", JSON.stringify(updatedSettings))
    }, [
        theme,
        language,
        fontSize,
        fontFamily,
        showGitHubCorner,
        isSettingsModified,
        appTheme,
    ])

    return (
        <SettingContext.Provider
            value={{
                theme,
                setTheme,
                language,
                setLanguage,
                fontSize,
                setFontSize,
                fontFamily,
                setFontFamily,
                showGitHubCorner,
                setShowGitHubCorner,
                isSettingsModified,
                setIsSettingsModified,
                appTheme,
                setAppTheme,
                resetSettings,
            }}
        >
            {children}
        </SettingContext.Provider>
    )
}

export { SettingContextProvider }
export default SettingContext
