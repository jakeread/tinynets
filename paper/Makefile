DOCNAME=root

all: report

.PHONY: clean

report:
	pdflatex $(DOCNAME).tex
	bibtex $(DOCNAME).aux
	pdflatex $(DOCNAME).tex
	pdflatex $(DOCNAME).tex
	@echo "Word Count:"
	detex $(DOCNAME).tex | wc -w
	wslview $(DOCNAME).pdf

view: report
	wslview $(DOCNAME).pdf

clean:
	rm *.blg *.bbl *.aux *.log