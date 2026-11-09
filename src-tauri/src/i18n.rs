use std::sync::OnceLock;

/// Textos del menú de la bandeja. La ventana usa su propio diccionario
/// (src/lang); ambos eligen idioma con la misma regla.
pub struct Texts {
    pub not_scanned: &'static str,
    /// Se le antepone el tamaño: "12.3 GB liberables".
    pub reclaimable: &'static str,
    pub show: &'static str,
    pub quit: &'static str,
}

const ES: Texts = Texts {
    not_scanned: "Sin analizar todavía",
    reclaimable: "liberables",
    show: "Mostrar ventana",
    quit: "Salir",
};

const EN: Texts = Texts {
    not_scanned: "Not analyzed yet",
    reclaimable: "reclaimable",
    show: "Show window",
    quit: "Quit",
};

/// Primer idioma preferido del sistema con traducción; si ninguno, inglés.
/// Debe coincidir con detectLanguage() en src/lang/index.ts.
fn pick(locales: impl Iterator<Item = String>) -> &'static Texts {
    for locale in locales {
        let code = locale
            .split(['-', '_'])
            .next()
            .unwrap_or("")
            .to_ascii_lowercase();
        match code.as_str() {
            "es" => return &ES,
            "en" => return &EN,
            _ => {}
        }
    }
    &EN
}

pub fn texts() -> &'static Texts {
    static TEXTS: OnceLock<&'static Texts> = OnceLock::new();
    TEXTS.get_or_init(|| pick(sys_locale::get_locales()))
}

#[cfg(test)]
mod tests {
    use super::pick;

    fn locales(list: &[&str]) -> impl Iterator<Item = String> {
        list.iter()
            .map(|s| s.to_string())
            .collect::<Vec<_>>()
            .into_iter()
    }

    #[test]
    fn picks_first_supported_language() {
        assert_eq!(pick(locales(&["es-ES", "en-US"])).quit, "Salir");
        assert_eq!(pick(locales(&["fr-FR", "es-MX"])).quit, "Salir");
        assert_eq!(pick(locales(&["en_GB"])).quit, "Quit");
        assert_eq!(pick(locales(&["ja-JP"])).quit, "Quit");
    }
}
