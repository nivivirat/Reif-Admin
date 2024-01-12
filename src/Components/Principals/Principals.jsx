import { onValue, ref, push, set, remove } from 'firebase/database';
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

    return (
        <div className="container mx-auto p-4">
            <button
                className="ml-4 bg-green-500 text-white py-1 px-2 rounded"
                onClick={handleAddSectionClick}
            >
                Add Section
            </button>
            {Object.entries(principalsData).map(([section, items]) => (
                <div key={section} className="mb-8 relative">
                    <div className='flex flex-row justify-between mr-[100px] my-10'>
                        <h2 className="text-2xl font-bold mb-4">
                            {section}
                        </h2>
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
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(items).map(([itemId, item]) => (
                            <PrincipalsCard
                                key={itemId}
                                id={itemId}
                                onEdit={() => handleEditClick(itemId)}
                                onDelete={() => handleDeleteClick(itemId)}
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
        </div>
    );
}
