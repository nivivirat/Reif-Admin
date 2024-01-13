import { onValue, ref, push, set, remove, update } from 'firebase/database';
import { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import PrincipalsCard from './PrincipalsComponents/PrincipalsCard';
import NewCardForm from './PrincipalsComponents/NewForm';
import EditForm from './PrincipalsComponents/EditForm';

export default function Principals() {
    const [principalsData, setPrincipalsData] = useState({});
    const [newCardForm, setNewCardForm] = useState({
        company_name: "",
        img: null,
        backContent: "",
        back2: "",
        back3: "",
        backLink: ""
    });
    const [isOpen, setIsOpen] = useState(false);
    const [currentSection, setCurrentSection] = useState("");
    const [editingCardId, setEditingCardId] = useState(null);
    const [isAddingNewCard, setIsAddingNewCard] = useState(false);

    const [changeSectionOrder, setChangeSectionOrder] = useState(false);

    useEffect(() => {
        const reff = ref(db, 'principals');
        onValue(reff, (snapshot) => {
            setPrincipalsData(snapshot.val());
        });
    }, []);

    const addNewCard = (section) => {
        if (editingCardId) {
            const cardRef = ref(db, `principals/${section}/${editingCardId}`);
            set(cardRef, newCardForm);
            setEditingCardId(null); // Reset editing state
        } else {
            const sectionRef = ref(db, `principals/${section}`);
            const newCardRef = push(sectionRef);
            const newCardKey = newCardRef.key;

            if (newCardForm.img) {
                const newCardData = {
                    ...newCardForm,
                    id: newCardKey,
                };

                set(ref(db, `principals/${section}/${newCardKey}`), newCardData);
            } else {
                const newCardData = {
                    ...newCardForm,
                    id: newCardKey,
                };

                set(ref(db, `principals/${section}/${newCardKey}`), newCardData);
            }
        }

        setNewCardForm({
            company_name: "",
            img: null,
            backContent: "",
            back2: "",
            back3: "",
            backLink: "",
        });
        setEditingCardId(null); // Reset editing state
        setIsOpen(false);
        setIsAddingNewCard(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setNewCardForm({
                    ...newCardForm,
                    img: event.target.result,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setNewCardForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleEditClick = (cardId) => {
        let sectionKey = null;
        let cardData = null;

        // Find the section and card data
        Object.keys(principalsData).forEach((section) => {
            if (principalsData[section] && principalsData[section][cardId]) {
                sectionKey = section;
                cardData = principalsData[section][cardId];
                return;
            }
        });

        if (cardData) {
            setNewCardForm({
                ...cardData,
                img: cardData.img || null,
            });
            setEditingCardId(cardId);
            setCurrentSection(sectionKey);
            setIsOpen(true);
            setIsAddingNewCard(false); // Set to false to indicate editing
        } else {
            console.error(`Card data not found for cardId: ${cardId}`);
        }
    };

    const handleDeleteClick = (cardId) => {
        if (window.confirm('Are you sure you want to delete this card?')) {
            Object.keys(principalsData).forEach((section) => {
                if (principalsData[section] && principalsData[section][cardId]) {
                    const cardRef = ref(db, `principals/${section}/${cardId}`);
                    remove(cardRef);
                }
            });
        }
    };

    const handleAddSectionClick = () => {
        const newSectionName = prompt('Enter the name for the new section:');
        if (newSectionName) {
            const sectionRef = ref(db, `principals/${newSectionName}`);
            const newCardRef = push(sectionRef);
            const newCardKey = newCardRef.key;

            setCurrentSection(newSectionName);
            setIsOpen(true);
            setIsAddingNewCard(true);
        }
    };

    const handleOrderChange = (section, cardId, newOrder) => {
        if (newOrder === "" || isNaN(newOrder)) {
            // If new order is empty or not a number, do nothing
            return;
        }

        const cardRef = ref(db, `principals/${section}/${cardId}`);
        update(cardRef, { order: newOrder });
    };

    const handleSectionOrderChange = (sectionId) => {
        const newOrder = prompt(`Enter the new order for ${sectionId}:`);
        if (newOrder !== null && !isNaN(newOrder)) {
            const sectionRef = ref(db, `principals/${sectionId}`);
            update(sectionRef, { s_order: parseInt(newOrder, 10) });
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div>
                {/* <button
                    className="ml-4 bg-green-500 text-white py-1 px-2 rounded"
                    onClick={handleAddSectionClick}
                >
                    Add Section
                </button> */}
                <button
                    className="ml-4 bg-primary text-white py-1 px-2 rounded"
                    onClick={() => setChangeSectionOrder(true)}
                >
                    Change order of section
                </button>
            </div>
            {Object.entries(principalsData)
                .sort(([, a], [, b]) => a.s_order - b.s_order) // Sort sections based on order
                .map(([section, sectionData]) => (
                    <div key={section} className="mb-8 relative">
                        <div className='flex flex-row justify-between mr-[100px] my-10'>
                            <div>
                                <h2 className="text-2xl font-bold mb-4">
                                    {section}
                                </h2>
                            </div>
                            <div>
                                <button
                                    className="ml-4 bg-primary text-white py-1 px-2 rounded"
                                    onClick={() => {
                                        setCurrentSection(section);
                                        setIsOpen(true);
                                        setIsAddingNewCard(true);
                                    }}
                                >
                                    Add Card
                                </button>
                                <button
                                    className="ml-2 bg-primary text-white py-1 px-2 rounded"
                                    onClick={() => handleSectionOrderChange(section)}
                                >
                                    Change Order
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(sectionData)
                                .filter(([key]) => key !== 's_order') // Exclude the section order field
                                .sort(([, a], [, b]) => a.order - b.order) // Sort cards based on order
                                .map(([itemId, item]) => (
                                    <PrincipalsCard
                                        key={itemId}
                                        id={itemId}
                                        onEdit={() => handleEditClick(itemId)}
                                        onDelete={() => handleDeleteClick(itemId)}
                                        onOrderChange={(newOrder) => handleOrderChange(section, itemId, newOrder)}
                                        {...item}
                                    />
                                ))}

                        </div>
                        {isAddingNewCard ? (
                            <NewCardForm
                                isOpen={isOpen}
                                topic={"Add New Card"}
                                onClose={() => setIsOpen(false)}
                                onAddCard={addNewCard}
                                section={currentSection}
                                newCardForm={newCardForm}
                                handleFormChange={handleFormChange}
                                handleFileChange={handleFileChange}
                            />
                        ) : (
                            <EditForm
                                isOpen={isOpen}
                                topic={"Edit Card"}
                                onClose={() => setIsOpen(false)}
                                onEditCard={() => addNewCard(currentSection)}
                                section={currentSection}
                                newCardForm={newCardForm}
                                handleFormChange={handleFormChange}
                                handleFileChange={handleFileChange}
                            />
                        )}
                    </div>
                ))}
            {changeSectionOrder ? (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-md">
                    <h2 className="text-xl font-bold mb-4">Change Section Order</h2>
                    {Object.entries(principalsData)
                        .sort(([, a], [, b]) => a.s_order - b.s_order)
                        .map(([section, sectionData]) => (
                            <div key={section} className="mb-4">
                                <span className="mr-4">{section}:</span>
                                <input
                                    type="number"
                                    value={sectionData.s_order}
                                    onChange={(e) => {
                                        const newOrder = parseInt(e.target.value, 10);
                                        if (!isNaN(newOrder)) {
                                            const sectionRef = ref(db, `principals/${section}`);
                                            update(sectionRef, { s_order: newOrder });
                                        }
                                    }}
                                />
                            </div>
                        ))}
                    <button
                        className="bg-primary text-white py-1 px-2 rounded"
                        onClick={() => setChangeSectionOrder(false)}
                    >
                        Save Changes
                    </button>
                </div>
            ) : (
                <div></div>
            )}

        </div>
    );
}