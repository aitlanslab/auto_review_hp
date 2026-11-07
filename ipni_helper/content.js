(async function () {

    console.log("IPNI EXTENSION STARTED");

    // Prevent duplicate injection
    if (document.getElementById("my-extension-button")) {
        return;
    }

    /**
     * Create floating button
     */
    const button = document.createElement("button");

    button.id = "my-extension-button";
    button.innerText = "Validate (IPNI)";

    Object.assign(button.style, {
        position: "fixed",
        right: "20px",
        bottom: "20px",
        zIndex: "999999",
        padding: "12px 16px",
        background: "#d80202",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
    });

    document.body.appendChild(button);

    /**
     * Create popup
     */
    const popup = document.createElement("div");

    popup.id = "my-extension-popup";

    Object.assign(popup.style, {
        position: "fixed",
        right: "90px",
        bottom: "20px",
        width: "380px",
        maxHeight: "70vh",
        overflowY: "auto",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
        zIndex: "999999",
        display: "none",
        fontFamily: "Arial, sans-serif",
        fontSize: "13px"
    });

    document.body.appendChild(popup);

    /**
     * Helper function to get values from page
     */
    function getValue(id) {
        const el = document.getElementById(id);
        if (!el) return null;
        return el.value || el.textContent?.trim();
    }

    /**
     * Helper function to clear a field's value
     */
    function clearFieldValue(fieldId) {
        const element = document.getElementById(fieldId);
        if (!element) {
            console.warn(`Element with id "${fieldId}" not found for clearing`);
            return false;
        }

        // Handle different element types
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.value = '';
            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.dispatchEvent(new Event('input', { bubbles: true }));
            console.log(`Cleared field ${fieldId}`);
        } else if (element.tagName === 'SELECT') {
            element.value = '';
            element.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`Cleared select ${fieldId}`);
        } else {
            element.textContent = '';
            element.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`Cleared text content of ${fieldId}`);
        }

        // Visual feedback
        const originalBg = element.style.backgroundColor;
        const originalOutline = element.style.outline;
        element.style.backgroundColor = '#fed7d7';
        element.style.outline = '2px solid #e53e3e';
        element.style.transition = 'all 0.2s ease';

        setTimeout(() => {
            element.style.backgroundColor = originalBg;
            element.style.outline = originalOutline;
        }, 500);

        return true;
    }

    /**
     * Helper function to set value on the page (supports multiple input types)
     */
    function setFieldValue(fieldId, value) {
        const element = document.getElementById(fieldId);
        if (!element) {
            console.warn(`Element with id "${fieldId}" not found`);
            return false;
        }

        // Handle different element types
        if (element.tagName === 'INPUT') {
            switch (element.type) {
                case 'checkbox':
                    // For checkboxes, value should be 'true', 'false', 'on', 'off', or boolean
                    const shouldCheck = value === 'true' || value === 'on' || value === '1' || value === 'yes' || value === true;
                    if (element.checked !== shouldCheck) {
                        element.checked = shouldCheck;
                        element.dispatchEvent(new Event('change', { bubbles: true }));
                        element.dispatchEvent(new Event('input', { bubbles: true }));
                        console.log(`Set checkbox ${fieldId} to: ${shouldCheck}`);
                    }
                    break;

                case 'radio':
                    // For radio buttons, check if this radio's value matches
                    if (element.value === value) {
                        element.checked = true;
                        element.dispatchEvent(new Event('change', { bubbles: true }));
                        element.dispatchEvent(new Event('input', { bubbles: true }));
                        console.log(`Set radio ${fieldId} to: ${value}`);
                    }
                    break;

                case 'text':
                case 'email':
                case 'number':
                case 'tel':
                case 'url':
                case 'search':
                case 'password':
                    element.value = value;
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                    console.log(`Set input ${fieldId} to: ${value}`);
                    break;

                default:
                    element.value = value;
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                    console.log(`Set input ${fieldId} to: ${value}`);
            }
        }
        else if (element.tagName === 'TEXTAREA') {
            element.value = value;
            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.dispatchEvent(new Event('input', { bubbles: true }));
            console.log(`Set textarea ${fieldId} to: ${value}`);
        }
        else if (element.tagName === 'SELECT') {
            element.value = value;
            element.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`Set select ${fieldId} to: ${value}`);
        }
        else {
            // For other elements (div, span, p, etc.), set text content
            element.textContent = value;
            element.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`Set text content of ${fieldId} to: ${value}`);
        }

        // Visual feedback
        const originalBg = element.style.backgroundColor;
        const originalOutline = element.style.outline;
        element.style.backgroundColor = '#e6fffa';
        element.style.outline = '2px solid #2c7a7b';
        element.style.transition = 'all 0.2s ease';

        setTimeout(() => {
            element.style.backgroundColor = originalBg;
            element.style.outline = originalOutline;
        }, 500);

        return true;
    }

    /**
     * Search IPNI via background script
     */
    async function searchIPNI(query) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                { action: 'searchIPNI', query: query },
                (response) => {
                    if (response && response.success) {
                        resolve(response.data);
                    } else {
                        reject(new Error(response?.error || 'Search failed'));
                    }
                }
            );
        });
    }

    /**
     * Fetch IPNI detail page via background script
     */
    async function fetchIPNIPage(url) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                { action: 'fetchIPNIPage', url: url },
                (response) => {
                    if (response && response.success) {
                        resolve(response.html);
                    } else {
                        reject(new Error(response?.error || 'Failed to fetch page'));
                    }
                }
            );
        });
    }

    /**
     * Get field helper for parsing detail page
     */
    function getField(doc, label) {
        const dt = [...doc.querySelectorAll("dt")]
            .find(el => el.textContent.includes(label));
        return dt?.nextElementSibling?.textContent.trim() || "N/A";
    }

    /**
     * Helper function to escape HTML and prevent XSS
     */
    function escapeHtml(str) {
        if (!str || str === "N/A") return "N/A";
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Create clickable field row (only for fields that need Fill button)
     */
    function createFieldRow(label, value, fieldId, showFillButton = true) {
        if (!value || value === "N/A") return '';

        if (showFillButton) {
            return `
                <div style="margin-bottom:6px; padding:4px; border-left: 3px solid #2c7a7b; background: #f7fafc;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong style="color:#2d3748; font-size:12px;">${label}:</strong>
                        <button 
                            class="fill-button" 
                            data-field-id="${fieldId}" 
                            data-value="${escapeHtml(value)}"
                            style="
                                background:#2c7a7b;
                                color:white;
                                border:none;
                                border-radius:4px;
                                padding:2px 8px;
                                font-size:11px;
                                cursor:pointer;
                                transition:background 0.2s;
                            "
                            onmouseover="this.style.background='#234e52'"
                            onmouseout="this.style.background='#2c7a7b'"
                        >
                            Fill
                        </button>
                    </div>
                    <div style="color:#4a5568; font-size:12px; margin-top:2px; word-break:break-word;">
                        ${escapeHtml(value)}
                    </div>
                </div>
            `;
        } else {
            return `
                <div style="margin-bottom:6px; padding:4px; border-left: 3px solid #cbd5e0; background: #f7fafc;">
                    <strong style="color:#2d3748; font-size:12px;">${label}:</strong>
                    <div style="color:#4a5568; font-size:12px; margin-top:2px; word-break:break-word;">
                        ${escapeHtml(value)}
                    </div>
                </div>
            `;
        }
    }

    /**
     * Open popup on button click
     */
    button.addEventListener("click", async () => {

        popup.style.display = "block";

        popup.innerHTML = `
            <div style="padding:12px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <h2 style="margin:0;font-size:18px;color:#2c7a7b;">IPNI Search</h2>
                    <button id="close-popup" style="border:none;background:none;cursor:pointer;font-size:20px;color:#718096;">✕</button>
                </div>
                <p style="text-align:center;color:#718096;">Loading...</p>
            </div>
        `;

        document
            .getElementById("close-popup")
            .addEventListener("click", () => {
                popup.style.display = "none";
            });

        try {

            /**
             * Get page values
             */
            const genus = getValue("genus");
            const species = getValue("species");

            console.log({
                genus,
                species
            });

            if (!genus) {
                throw new Error("Genus not found on this page");
            }

            /**
             * Build keyword
             */
            let keyword = `${genus} ${species || ""}`.trim();

            /**
             * Search IPNI
             */
            let searchJson = await searchIPNI(keyword);

            /**
             * Fallback to genus only
             */
            if (!searchJson.results || !searchJson.results.length) {

                console.log("Retrying with genus only...");

                keyword = genus;

                searchJson = await searchIPNI(keyword);
            }

            /**
             * No results
             */
            if (!searchJson.results || !searchJson.results.length) {

                popup.innerHTML = `
                    <div style="padding:12px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                            <h2 style="margin:0;font-size:18px;color:#2c7a7b;">IPNI Search</h2>
                            <button id="close-popup" style="border:none;background:none;cursor:pointer;font-size:20px;color:#718096;">✕</button>
                        </div>
                        <div style="text-align:center;padding:20px;">
                            <p style="color:#e53e3e;">No records found for "${escapeHtml(keyword)}"</p>
                            <button id="close-popup-btn" style="margin-top:10px;padding:6px 12px;background:#2c7a7b;color:white;border:none;border-radius:4px;cursor:pointer;">Close</button>
                        </div>
                    </div>
                `;

                document
                    .getElementById("close-popup")
                    .addEventListener("click", () => {
                        popup.style.display = "none";
                    });

                const closeBtn = document.getElementById("close-popup-btn");
                if (closeBtn) {
                    closeBtn.addEventListener("click", () => {
                        popup.style.display = "none";
                    });
                }

                return;
            }

            /**
             * First result
             */
            const firstResult = searchJson.results[0];

            /**
             * Build page URL
             */
            const pageUrl = `https://ipni.org${firstResult.url}`;

            /**
             * Fetch detail page via background script
             */
            const html = await fetchIPNIPage(pageUrl);

            /**
             * Parse HTML
             */
            const doc = new DOMParser()
                .parseFromString(html, "text/html");

            /**
             * Authors
             */
            const authors = [...doc.querySelectorAll(".author-link")]
                .map(el => el.textContent.trim());

            /**
             * Get author citation
             */
            const authorCitation = authors.join(" ex ") || "N/A";
            
            /**
             * Build scientific name: genus + species + author citation
             */
            const scientificName = `${genus} ${species || ''} ${authorCitation !== "N/A" ? authorCitation : ''}`.trim().replace(/\s+/g, ' ');

            /**
             * Final data
             */
            const data = {
                searchedKeyword: keyword,
                pageUrl,
                family: getField(doc, "Family as entered in IPNI"),
                authorCitation: authorCitation,
                scientificName: scientificName,
                locality: getField(doc, "Locality"),
                distribution: getField(doc, "Distribution Of Types"),
                remarks: getField(doc, "Remarks")
            };

            console.log("IPNI Data:", data);

            /**
             * Clear the current_name field
             */
            clearFieldValue("current_name");
            console.log("Cleared current_name field");

            /**
             * Build popup HTML with clickable fields
             * Family, Author Citation, and Scientific Name have Fill buttons
             */
            let fieldsHtml = '';

            // Scientific Name field with Fill button
            fieldsHtml += createFieldRow('Scientific Name', data.scientificName, 'scientific_name', true);
            
            // Family field with Fill button
            fieldsHtml += createFieldRow('Family', data.family, 'family', true);
            
            // Author Citation with Fill button (using author_name as field ID)
            fieldsHtml += createFieldRow('Author Citation', data.authorCitation, 'author_name', true);
            
            // Other fields (display only, no Fill buttons)
            fieldsHtml += createFieldRow('Locality', data.locality, '', false);
            fieldsHtml += createFieldRow('Distribution', data.distribution, '', false);
            fieldsHtml += createFieldRow('Remarks', data.remarks, '', false);

            popup.innerHTML = `
                <div style="padding:12px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:2px solid #e2e8f0;padding-bottom:8px;">
                        <h2 style="margin:0;font-size:18px;color:#2c7a7b;">IPNI Information</h2>
                        <button id="close-popup" style="border:none;background:none;cursor:pointer;font-size:20px;color:#718096;">✕</button>
                    </div>
                    
                    <div style="margin-bottom:10px;padding:6px;background:#edf2f7;border-radius:6px;">
                        <div style="font-size:11px;color:#4a5568;">
                            <strong>Search Keyword:</strong> ${escapeHtml(data.searchedKeyword)}
                        </div>
                        <div style="font-size:11px;color:#4a5568;margin-top:4px;">
                            <strong>Source:</strong> 
                            <a href="${data.pageUrl}" target="_blank" style="color:#2c7a7b;text-decoration:none;">Open IPNI Page →</a>
                        </div>
                    </div>
                    
                    <div id="ipni-fields-container" style="max-height:400px;overflow-y:auto;">
                        ${fieldsHtml}
                    </div>
                    
                    <div style="margin-top:10px;padding-top:8px;border-top:1px solid #e2e8f0;text-align:center;font-size:10px;color:#a0aec0;">
                        Click "Fill" to auto-populate fields on the page
                    </div>
                </div>
            `;

            /**
             * Reattach close event
             */
            document
                .getElementById("close-popup")
                .addEventListener("click", () => {
                    popup.style.display = "none";
                });

            /**
             * Attach click handlers to all fill buttons
             */
            const fillButtons = document.querySelectorAll('.fill-button');
            fillButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const fieldId = btn.getAttribute('data-field-id');
                    const value = btn.getAttribute('data-value');

                    if (fieldId && value) {
                        setFieldValue(fieldId, value);
                        // Also set the flag field if it exists
                        const flagField = document.getElementById("flag_" + fieldId);
                        if (flagField) {
                            setFieldValue("flag_" + fieldId, 0);
                        }
                        // Show success feedback on button
                        const originalText = btn.textContent;
                        btn.textContent = '✓ Filled!';
                        setTimeout(() => {
                            btn.textContent = originalText;
                        }, 1000);
                    }
                });
            });

        } catch (error) {

            console.error("IPNI Extension Error:", error);

            popup.innerHTML = `
                <div style="padding:12px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                        <h2 style="margin:0;font-size:18px;color:#e53e3e;">Error</h2>
                        <button id="close-popup" style="border:none;background:none;cursor:pointer;font-size:20px;color:#718096;">✕</button>
                    </div>
                    <div style="text-align:center;padding:15px;">
                        <p style="color:#e53e3e;font-size:13px;">${escapeHtml(error.message)}</p>
                        <button id="close-popup-btn" style="margin-top:10px;padding:6px 12px;background:#2c7a7b;color:white;border:none;border-radius:4px;cursor:pointer;">Close</button>
                    </div>
                </div>
            `;

            document
                .getElementById("close-popup")
                .addEventListener("click", () => {
                    popup.style.display = "none";
                });

            const closeBtn = document.getElementById("close-popup-btn");
            if (closeBtn) {
                closeBtn.addEventListener("click", () => {
                    popup.style.display = "none";
                });
            }
        }

    });

})();